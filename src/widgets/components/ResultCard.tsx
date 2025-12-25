import { RequestRow } from "@/app/page";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "../../shared/utils/cn";
import {
  Calendar,
  ChevronRight,
  FileText,
  Mail,
  Phone,
  Send,
  Loader2,
} from "lucide-react";
import parseContacts from "@/shared/utils/parseContacts";
import formatDate from "../../shared/utils/formatDate";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Resolver, useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ResultCardProps {
  data: RequestRow;
  isExpanded: boolean;
  onToggle: () => void;
  canToggle: boolean;
}

const requiredPositiveNumberField = z
  .preprocess((val) => {
    if (typeof val === "string") val = val.trim();
    if (val === "") return undefined;
    const num = Number(val);
    return isNaN(num) ? undefined : num;
  }, z.union([z.number(), z.undefined()]))
  .superRefine((val, ctx) => {
    if (val === undefined) {
      ctx.addIssue({
        code: "custom",
        message: "Введите число",
      });
      return;
    }
    if (!Number.isInteger(val)) {
      ctx.addIssue({
        code: "custom",
        message: "Должно быть целым числом",
      });
    }
    if (val < 0) {
      ctx.addIssue({
        code: "custom",
        message: "Должно быть положительным числом",
      });
    }
  });

const schema = z.object({
  protocol_number: requiredPositiveNumberField,
  question_number: requiredPositiveNumberField,
  actual_member_number: requiredPositiveNumberField,
  expected_member_number: requiredPositiveNumberField,
  votes_for: requiredPositiveNumberField,
  votes_against: requiredPositiveNumberField,
  votes_abstained: requiredPositiveNumberField,
  agenda_question: z
    .string()
    .nonempty("Поле не может быть пустым")
    .min(3, "Поле должно содержать минимум 5 символа"),
  meeting_progress: z
    .string()
    .nonempty("Поле не может быть пустым")
    .min(5, "Поле должно содержать минимум 5 символа"),
  meeting_solution: z
    .string()
    .nonempty("Поле не может быть пустым")
    .min(5, "Поле должно содержать минимум 5 символа"),
});

export type formFields = z.infer<typeof schema>;

function ResultCard({
  data,
  isExpanded,
  onToggle,
  canToggle,
}: ResultCardProps) {
  const { phone, email } = parseContacts(data.Контакты);

  const [documentId, setDocumentId] = useState<string | null>(null);
  const [emailStatus, setEmailStatus] = useState<false | "sending" | "sent">(
    false
  );

  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<formFields>({
    resolver: zodResolver(schema) as Resolver<formFields>,
    defaultValues: {
      agenda_question: data?.Вопрос || "",
    },
  });

  useEffect(() => {
    reset((prev) => ({
      ...prev,
      agenda_question: data?.Вопрос || "",
    }));
  }, [data, reset]);

  const onSubmit: SubmitHandler<formFields> = async (formData) => {
    try {
      const payload = {
        ...formData,
        protocol_number: Number(formData.protocol_number),
        question_number: Number(formData.question_number),
        actual_member_number: Number(formData.actual_member_number),
        expected_member_number: Number(formData.expected_member_number),
        votes_for: Number(formData.votes_for),
        votes_against: Number(formData.votes_against),
        votes_abstained: Number(formData.votes_abstained),
        student_name: data?.ФИО,
      };

      const res = await fetch("/api/send-protocol", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();

      if (!res.ok) {
        setError("root", {
          type: "manual",
          message: resData.error || "Ошибка отправки",
        });
        return;
      }

      if (resData?.document_id) {
        setDocumentId(resData.document_id);
        const url = `https://docs.google.com/document/d/${resData.document_id}/edit`;
        window.open(url, "_blank");
      } else {
        setError("root", {
          type: "manual",
          message: "Сервер не вернул ID Google Docs",
        });
      }
    } catch (err: any) {
      setError("root", {
        type: "manual",
        message: err.message || "Не удалось отправить",
      });
    }
  };

  const handleSendEmail = async () => {
    if (!documentId) return;

    setEmailStatus("sending");

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_name: data?.ФИО,
          student_email: email || "",
          student_question: data?.Вопрос || "",
          document_id: documentId,
          request_number: data?.["Номер Обращения"] || "",
        }),
      });

      if (!res.ok) {
        const resData = await res.json();
        console.error(
          "Ошибка отправки на почту:",
          resData.error || res.statusText
        );

        setEmailStatus(false);
      } else {
        setEmailStatus("sent");
        reset();
        setDocumentId(null);

        router.refresh();

        setTimeout(() => setEmailStatus(false), 1000);
      }
    } catch (err: any) {
      console.error("Ошибка отправки на почту:", err.message);
      setEmailStatus(false);
    }
  };

  return (
    <>
      <Card className="result-card xl:col-span-3">
        <CardHeader>
          <div className="mb-3 flex items-center justify-between gap-3">
            {data["Номер Обращения"] && (
              <div className="card-request-number flex items-center justify-between gap-2 text-xs text-gray-500">
                <p className="request-id">ID:</p>

                <div className="text-pretty px-2 py-1 bg-gray-100 rounded">
                  {data["Номер Обращения"]}
                </div>
              </div>
            )}

            <button
              type="button"
              aria-expanded={isExpanded && canToggle}
              onClick={onToggle}
              className={cn(
                "status-toggled-icon flex justify-center items-center gap-2",
                "hover:bg-gray-100 p-1.5 rounded-full transition-all duration-300 cursor-pointer"
              )}>
              <ChevronRight
                className={cn(
                  "h-5 w-5 text-muted-foreground transition-transform duration-300",
                  isExpanded ? "rotate-90" : ""
                )}
              />
            </button>
          </div>

          <CardTitle className="fullname text-balance text-xl leading-tight">
            {data.ФИО}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 space-y-4">
          {phone && (
            <div className="card-phone flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span className="truncate">{phone}</span>
            </div>
          )}

          {email && (
            <div className="card-phone flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span className="truncate">{email}</span>
            </div>
          )}

          {data.Вопрос && (
            <div className="card-question space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground">
                Вопрос
              </p>

              <div className="overflow-hidden transition-all duration-300 ease-in-out">
                <p className="text-pretty text-sm text-gray-800 leading-relaxed">
                  {data.Вопрос}
                </p>
              </div>
            </div>
          )}

          <div className="card-date-category flex items-center justify-between">
            {data.Дата && (
              <div className="card-date flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />

                {formatDate(data.Дата)}
              </div>
            )}

            {data.Категория && (
              <div className="card-category flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {data.Категория}
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div
        className={cn(
          "overflow-hidden transition-all duration-500 ease-out xl:col-span-4 rounded-xl",
          isExpanded && canToggle
            ? "max-h-[2000px] flex-1 opacity-100 xl:max-h-none"
            : "max-h-0 flex-1 opacity-0 xl:w-0"
        )}>
        <Card className="h-full bg-linear-to-br from-primary/5 via-card to-accent/10 shadow-xl ring-1 ring-primary/10">
          <div className="h-full overflow-y-auto p-6">
            <div className="mb-6 flex items-center justify-between border-b pb-4">
              <div>
                <h4 className="text-lg font-semibold">Детали протокола</h4>
                <p className="text-sm text-muted-foreground">
                  Заполните информацию о заседании
                </p>
              </div>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              {errors.root && (
                <p className="text-sm text-red-500">{errors.root.message}</p>
              )}

              <div className="number-protocol-question grid grid-cols-1 lg:grid-cols-2 gap-4 ">
                <div className="space-y-2">
                  <Label
                    htmlFor={`protocol-${data["Номер Обращения"]?.replace(
                      /\s+/g,
                      "-"
                    )}`}
                    className="flex items-center gap-1 text-sm font-medium">
                    Номер протокола
                    <span className="text-destructive">*</span>
                  </Label>

                  <Input
                    id={`protocol-${data["Номер Обращения"]?.replace(
                      /\s+/g,
                      "-"
                    )}`}
                    type="number"
                    placeholder="2"
                    className="border-muted-foreground/20 transition-all focus:ring-2 focus:ring-primary/20"
                    {...register("protocol_number")}
                  />

                  {errors.protocol_number && (
                    <p className="text-sm text-red-500">
                      {errors.protocol_number.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor={`question-${data["Номер Обращения"]}`}
                    className="flex items-center gap-1 text-sm font-medium">
                    Номер вопроса
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={`question-${data["Номер Обращения"]?.replace(
                      /\s+/g,
                      "-"
                    )}`}
                    type="number"
                    placeholder="10"
                    className="border-muted-foreground/20 transition-all focus:ring-2 focus:ring-primary/20"
                    {...register("question_number")}
                  />

                  {errors.question_number && (
                    <p className="text-sm text-red-500">
                      {errors.question_number.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor={`agenda-${data["Номер Обращения"]}`}
                  className="text-sm font-medium">
                  Вопрос повестки дня
                </Label>
                <Input
                  id={`agenda-${data["Номер Обращения"]?.replace(/\s+/g, "-")}`}
                  placeholder="Выбор председателя комиссии по обеспечению качества ШЦТ..."
                  className="border-muted-foreground/20 transition-all focus:ring-2 focus:ring-primary/20"
                  {...register("agenda_question")}
                />

                {errors.agenda_question && (
                  <p className="text-sm text-red-500">
                    {errors.agenda_question.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor={`progress-${data["Номер Обращения"]?.replace(
                    /\s+/g,
                    "-"
                  )}`}
                  className="flex items-center gap-1 text-sm font-medium">
                  Ход заседания
                  <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  maxLength={1000}
                  id={`progress-${data["Номер Обращения"]}`}
                  placeholder="Директор школы ознакомил членов комиссии с повесткой дня..."
                  rows={4}
                  className="resize-none border-muted-foreground/20 transition-all focus:ring-2 focus:ring-primary/20"
                  {...register("meeting_progress")}
                />

                {errors.meeting_progress && (
                  <p className="text-sm text-red-500">
                    {errors.meeting_progress.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor={`solution-${data["Номер Обращения"]?.replace(
                    /\s+/g,
                    "-"
                  )}`}
                  className="flex items-center gap-1 text-sm font-medium">
                  Решение заседания
                  <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id={`solution-${data["Номер Обращения"]?.replace(
                    /\s+/g,
                    "-"
                  )}`}
                  maxLength={1000}
                  placeholder="Назначить председателя КОК ШЦТ – Сапажанова Е.С., технического секретаря – Ахметжан Д.М."
                  rows={3}
                  className="resize-none border-muted-foreground/20 transition-all focus:ring-2 focus:ring-primary/20"
                  {...register("meeting_solution")}
                />

                {errors.meeting_solution && (
                  <p className="text-sm text-red-500">
                    {errors.meeting_solution.message}
                  </p>
                )}
              </div>

              <div className="member-numbers mb-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="actualMemberNumber">
                    Фактическое количество членов{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="actualMemberNumber"
                    type="number"
                    placeholder="8"
                    {...register("actual_member_number")}
                    className="bg-[#f8f8f8]"
                  />

                  {errors.actual_member_number && (
                    <p className="text-sm text-red-500">
                      {errors.actual_member_number.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expectedMemberNumber">
                    Ожидаемое количество членов
                  </Label>
                  <Input
                    id="expectedMemberNumber"
                    type="number"
                    className="bg-[#f8f8f8] cursor-not-allowed"
                    defaultValue={16}
                    readOnly
                    {...register("expected_member_number")}
                    tabIndex={-1}
                  />

                  {errors.expected_member_number && (
                    <p className="text-sm text-red-500">
                      {errors.expected_member_number.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="votes-wrapper space-y-3 rounded-lg bg-muted/50 p-4">
                <Label className="text-sm font-semibold">
                  Результаты голосования
                </Label>

                <div className="votes grid grid-cols-1 lg:grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label
                      htmlFor={`votes-for-${data["Номер Обращения"]?.replace(
                        /\s+/g,
                        "-"
                      )}`}
                      className="flex items-center gap-1 text-xs text-muted-foreground">
                      Голосов "За"
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id={`votes-for-${data["Номер Обращения"]?.replace(
                        /\s+/g,
                        "-"
                      )}`}
                      type="number"
                      min="0"
                      placeholder="8"
                      className="border-muted-foreground/20 bg-background transition-all focus:ring-2 focus:ring-primary/20"
                      {...register("votes_for")}
                    />

                    {errors.votes_for && (
                      <p className="text-sm text-red-500">
                        {errors.votes_for.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor={`votes-against-${data[
                        "Номер Обращения"
                      ]?.replace(/\s+/g, "-")}`}
                      className="flex items-center gap-1 text-xs text-muted-foreground">
                      Голосов "Против"
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id={`votes-against-${data["Номер Обращения"]?.replace(
                        /\s+/g,
                        "-"
                      )}`}
                      type="number"
                      min="0"
                      placeholder="0"
                      className="border-muted-foreground/20 bg-background transition-all focus:ring-2 focus:ring-primary/20"
                      {...register("votes_against")}
                    />

                    {errors.votes_against && (
                      <p className="text-sm text-red-500">
                        {errors.votes_against.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor={`votes-abstained-${data[
                        "Номер Обращения"
                      ]?.replace(/\s+/g, "-")}`}
                      className="flex items-center gap-1 text-xs text-muted-foreground">
                      Воздержались
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id={`votes-abstained-${data["Номер Обращения"]?.replace(
                        /\s+/g,
                        "-"
                      )}`}
                      type="number"
                      min="0"
                      placeholder="1"
                      className="border-muted-foreground/20 bg-background transition-all focus:ring-2 focus:ring-primary/20"
                      {...register("votes_abstained")}
                    />

                    {errors.votes_abstained && (
                      <p className="text-sm text-red-500">
                        {errors.votes_abstained.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="btns-wrapper grid grid-cols-1 xl:grid-cols-2 gap-3 border-t pt-4">
                <Button
                  type="submit"
                  variant="outline"
                  disabled={isSubmitting}
                  className="flex-1">
                  {isSubmitting ? (
                    <div className="icon-preview-btn-loading flex items-center gap-2">
                      <Loader2 className="size-4 animate-spin" />
                      <span>Предпросмотр в Google Docs</span>
                    </div>
                  ) : (
                    <div className="icon-preview-btn flex items-center gap-2">
                      <FileText className="size-4" />
                      <span>Предпросмотр в Google Docs</span>
                    </div>
                  )}
                </Button>

                <Button
                  type="button"
                  onClick={handleSendEmail}
                  disabled={
                    !documentId ||
                    emailStatus === "sending" ||
                    emailStatus === "sent"
                  }
                  className="flex-1 flex items-center justify-center gap-2">
                  {emailStatus === "sending" ? (
                    <>
                      <Loader2 className="size-4 animate-spin text-gray-400" />
                      <span>Отправка...</span>
                    </>
                  ) : (
                    <>
                      <Send className="size-4" />

                      <span>
                        {emailStatus === "sent"
                          ? "Отправлено"
                          : "Отправить на почту"}
                      </span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </Card>
      </div>
    </>
  );
}

export default ResultCard;
