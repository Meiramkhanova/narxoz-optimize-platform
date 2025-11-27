import { RequestRow } from "@/app/page";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "../../shared/utils/cn";
import { Calendar, ChevronRight, Mail, Phone } from "lucide-react";
import parseContacts from "@/shared/utils/parseContacts";
import formatDate from "../../shared/utils/formatDate";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface ResultCardProps {
  data: RequestRow;
  order: number;
  isExpanded: boolean;
  onToggle: () => void;
  canToggle: boolean;
}

const statusColors = {
  NEW: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
};

function ResultCard({
  data,
  order,
  isExpanded,
  onToggle,
  canToggle,
}: ResultCardProps) {
  const { phone, email } = parseContacts(data.Контакты);

  return (
    <>
      <Card
        className={cn(
          "result-card xl:col-span-3",
          isExpanded
            ? "ring-2 ring-primary/50 shadow-xl"
            : "hover:shadow-md hover:ring-1 hover:ring-primary/20",
          !canToggle ? "invisible" : ""
        )}
        onClick={onToggle}>
        <CardHeader>
          <div className="mb-3 flex items-center justify-between gap-3">
            {/* <Badge variant="outline" className="text-xs font-medium rounded-md">
              {`REQ-${String(order).padStart(3, "0")}`}
            </Badge> */}

            {data["Номер Обращения"] && (
              <div className="card-request-number flex items-center justify-between gap-2 text-xs text-gray-500">
                <p className="request-id">ID:</p>

                <div className="text-pretty px-2 py-1 bg-gray-100 rounded">
                  {data["Номер Обращения"]}
                </div>
              </div>
            )}

            <div className="status-toggled-icon flex items-center gap-2">
              {/* <Badge
                className={cn(
                  "text-xs font-medium",
                  statusColors[data.Статус]
                )}>
                {data.Статус}
              </Badge> */}

              <ChevronRight
                className={cn(
                  "h-5 w-5 text-muted-foreground transition-transform duration-300",
                  isExpanded ? "rotate-90" : ""
                )}
              />
            </div>
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
                Question
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
          "overflow-hidden transition-all duration-500 ease-out xl:col-span-4",
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

            <form className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label
                    htmlFor={`protocol-${data["Номер Обращения"]}`}
                    className="flex items-center gap-1 text-sm font-medium">
                    Номер протокола
                    <span className="text-destructive">*</span>
                  </Label>

                  <Input
                    id={`protocol-${data["Номер Обращения"]}`}
                    type="number"
                    placeholder="2"
                    className="border-muted-foreground/20 transition-all focus:ring-2 focus:ring-primary/20"
                    // value={formData.protocol_number}
                    // onChange={(e) =>
                    //   setFormData({
                    //     ...formData,
                    //     protocol_number: e.target.value,
                    //   })
                    // }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor={`question-${data["Номер Обращения"]}`}
                    className="flex items-center gap-1 text-sm font-medium">
                    Номер вопроса
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={`question-${data["Номер Обращения"]}`}
                    type="number"
                    placeholder="10"
                    className="border-muted-foreground/20 transition-all focus:ring-2 focus:ring-primary/20"
                    // value={formData.question_number}
                    // onChange={(e) =>
                    //   setFormData({
                    //     ...formData,
                    //     question_number: e.target.value,
                    //   })
                    // }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor={`agenda-${data["Номер Обращения"]}`}
                  className="text-sm font-medium">
                  Вопрос повестки дня
                </Label>
                <Input
                  id={`agenda-${data["Номер Обращения"]}`}
                  placeholder="Выбор председателя комиссии по обеспечению качества ШЦТ..."
                  className="border-muted-foreground/20 transition-all focus:ring-2 focus:ring-primary/20"
                  // value={formData.agenda_question}
                  // onChange={(e) =>
                  //   setFormData({
                  //     ...formData,
                  //     agenda_question: e.target.value,
                  //   })
                  // }
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor={`progress-${data["Номер Обращения"]}`}
                  className="flex items-center gap-1 text-sm font-medium">
                  Ход заседания
                  <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id={`progress-${data["Номер Обращения"]}`}
                  placeholder="Директор школы ознакомил членов комиссии с повесткой дня..."
                  rows={4}
                  className="resize-none border-muted-foreground/20 transition-all focus:ring-2 focus:ring-primary/20"
                  // value={formData.meeting_progress}
                  // onChange={(e) =>
                  //   setFormData({
                  //     ...formData,
                  //     meeting_progress: e.target.value,
                  //   })
                  // }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor={`solution-${data["Номер Обращения"]}`}
                  className="flex items-center gap-1 text-sm font-medium">
                  Решение заседания
                  <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id={`solution-${data["Номер Обращения"]}`}
                  placeholder="Назначить председателя КОК ШЦТ – Сапажанова Е.С., технического секретаря – Ахметжан Д.М."
                  rows={3}
                  className="resize-none border-muted-foreground/20 transition-all focus:ring-2 focus:ring-primary/20"
                  // value={formData.meeting_solution}
                  // onChange={(e) =>
                  //   setFormData({
                  //     ...formData,
                  //     meeting_solution: e.target.value,
                  //   })
                  // }
                  required
                />
              </div>

              <div className="member-numbers mb-6 grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="actualMemberNumber">
                    Фактическое количество членов{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="actualMemberNumber"
                    type="number"
                    placeholder="8"
                    // value={formData.actualMemberNumber}
                    // onChange={(e) =>
                    //   handleChange("actualMemberNumber", e.target.value)
                    // }
                    required
                    className="bg-[#f8f8f8]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expectedMemberNumber">
                    Ожидаемое количество членов{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="expectedMemberNumber"
                    type="number"
                    placeholder="12"
                    // value={formData.expectedMemberNumber}
                    // onChange={(e) =>
                    //   handleChange("expectedMemberNumber", e.target.value)
                    // }
                    required
                    className="bg-[#f8f8f8]"
                  />
                </div>
              </div>

              <div className="votes-wrapper space-y-3 rounded-lg bg-muted/50 p-4">
                <Label className="text-sm font-semibold">
                  Результаты голосования
                </Label>

                <div className="votes grid gap-3 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label
                      htmlFor={`votes-for-${data["Номер Обращения"]}`}
                      className="flex items-center gap-1 text-xs text-muted-foreground">
                      Голосов "За"
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id={`votes-for-${data["Номер Обращения"]}`}
                      type="number"
                      min="0"
                      placeholder="8"
                      className="border-muted-foreground/20 bg-background transition-all focus:ring-2 focus:ring-primary/20"
                      // value={formData.votes_for}
                      // onChange={(e) =>
                      //   setFormData({ ...formData, votes_for: e.target.value })
                      // }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor={`votes-against-${data["Номер Обращения"]}`}
                      className="flex items-center gap-1 text-xs text-muted-foreground">
                      Голосов "Против"
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id={`votes-against-${data["Номер Обращения"]}`}
                      type="number"
                      min="0"
                      placeholder="0"
                      className="border-muted-foreground/20 bg-background transition-all focus:ring-2 focus:ring-primary/20"
                      // value={formData.votes_against}
                      // onChange={(e) =>
                      //   setFormData({
                      //     ...formData,
                      //     votes_against: e.target.value,
                      //   })
                      // }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor={`votes-abstained-${data["Номер Обращения"]}`}
                      className="flex items-center gap-1 text-xs text-muted-foreground">
                      Воздержались
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id={`votes-abstained-${data["Номер Обращения"]}`}
                      type="number"
                      min="0"
                      placeholder="1"
                      className="border-muted-foreground/20 bg-background transition-all focus:ring-2 focus:ring-primary/20"
                      // value={formData.votes_abstained}
                      // onChange={(e) =>
                      //   setFormData({
                      //     ...formData,
                      //     votes_abstained: e.target.value,
                      //   })
                      // }
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="btns-wrapper flex gap-3 border-t pt-4">
                <Button
                  type="submit"
                  className="flex-1 shadow-sm hover:shadow-md">
                  Сохранить
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={onToggle}
                  className="flex-1 hover:bg-muted bg-transparent">
                  Отменить
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
