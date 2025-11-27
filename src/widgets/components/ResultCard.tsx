import { RequestRow } from "@/app/page";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "../../shared/utils/cn";
import { Calendar, Mail, Phone } from "lucide-react";
import parseContacts from "@/shared/utils/parseContacts";
import formatDate from "../../shared/utils/formatDate";

interface ResultCardProps {
  data: RequestRow;
  order: number;
  isExpanded: boolean;
  onToggle: () => void;
}

const statusColors = {
  NEW: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
};

function ResultCard({ data, order, isExpanded, onToggle }: ResultCardProps) {
  const { phone, email } = parseContacts(data.Контакты);

  return (
    <Card className={cn("result-card")}>
      <CardHeader>
        <div className="mb-3 flex items-center justify-between gap-3">
          <Badge variant="outline" className="text-xs font-medium rounded-md">
            {`REQ-${String(order).padStart(3, "0")}`}
          </Badge>

          <Badge
            className={cn("text-xs font-medium", statusColors[data.Статус])}>
            {data.Статус}
          </Badge>
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

            <div
              className={cn(
                " overflow-hidden transition-all duration-300 ease-in-out"
                // isExpanded ? "max-h-[2000px]" : "max-h-36"
              )}>
              <p
                className={cn(
                  "text-pretty text-sm text-gray-800 leading-relaxed"
                  // isExpanded ? "" : "line-clamp-6"
                )}>
                {data.Вопрос}
              </p>
            </div>

            {/* {data.Вопрос.length > 300 && (
              <div className="w-full flex justify-end">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className={cn(
                    "flex items-center gap-1.5 text-xs text-muted-foreground",
                    "hover:text-foreground transition-colors duration-300 cursor-pointer"
                  )}>
                  <span className="underline decoration-dotted underline-offset-4">
                    {isExpanded ? "Свернуть" : "Читать полностью"}
                  </span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-300 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>
            )} */}
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

        {data["Номер Обращения"] && (
          <div className="card-request-number flex items-center justify-between gap-2 text-xs text-gray-500">
            <p className="request-id">ID обращения</p>

            <div className="text-pretty px-2 py-1 bg-gray-100 rounded">
              {data["Номер Обращения"]}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default ResultCard;
