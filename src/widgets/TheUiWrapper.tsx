"use client";

import { RequestRow } from "@/app/page";
import Header from "./Header";
import Container from "@/shared/ui/Container";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import ResultCard from "@/widgets/components/ResultCard";

interface TheUiWrapperProps {
  typedRows: RequestRow[];
}

function TheUiWrapper({ typedRows }: TheUiWrapperProps) {
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [selectedQuestion, setSelectedQuestion] = useState<string>("");

  const [appliedStudent, setAppliedStudent] = useState<string>("all");
  const [appliedQuestion, setAppliedQuestion] = useState<string>("all");

  const [expandedId, setExpandedId] = useState<string | null>(null);

  const uniqueStudents = Array.from(
    new Set(typedRows.map((req) => req.ФИО).filter(Boolean))
  );

  const questionsForStudent =
    selectedStudent === "all"
      ? []
      : typedRows
          .filter((req) => req.ФИО === selectedStudent)
          .map((req) => req.Вопрос);

  const uniqueQuestions = Array.from(new Set(questionsForStudent)).filter(
    Boolean
  );

  const handleApplyFilters = () => {
    setAppliedStudent(selectedStudent);
    setAppliedQuestion(selectedQuestion);
    setExpandedId(null);
  };

  const handleResetFilters = () => {
    setSelectedStudent("");
    setSelectedQuestion("");
    setAppliedStudent("");
    setAppliedQuestion("");
    setExpandedId(null);
  };

  const filteredRequests = typedRows.filter(
    (request) =>
      request.ФИО === appliedStudent && request.Вопрос === appliedQuestion
  );

  const canToggle = filteredRequests.length === 1;

  return (
    <div className="xl:min-h-screen bg-background">
      <Header />

      <main className="py-6">
        <Container>
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              Фильтр запросов студентов
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
              <div className="space-y-2">
                <label className="text-sm font-medium">Имя студента</label>
                <Select
                  value={selectedStudent}
                  onValueChange={(value) => {
                    setSelectedStudent(value);
                    setSelectedQuestion("");
                  }}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Выберите студента" />
                  </SelectTrigger>
                  <SelectContent position="popper" align="start">
                    {uniqueStudents.map((student) => (
                      <SelectItem key={student} value={student}>
                        {student}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Вопрос</label>
                <Select
                  value={selectedQuestion}
                  onValueChange={setSelectedQuestion}
                  disabled={selectedStudent === "all"}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Выберите вопрос" />
                  </SelectTrigger>
                  <SelectContent position="popper" align="start">
                    {uniqueQuestions.map((question) => (
                      <SelectItem key={question} value={question}>
                        {question}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedStudent === "all" && (
                  <p className="text-xs text-muted-foreground">
                    Сначала выберите студента
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-6">
              <Button
                onClick={handleApplyFilters}
                className="flex-1 md:flex-none"
                disabled={selectedStudent === "all" || selectedQuestion === ""}>
                Применить фильтры
              </Button>

              <Button
                onClick={handleResetFilters}
                variant="outline"
                className="flex-1 md:flex-none bg-transparent">
                Сбросить
              </Button>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-7 gap-6 mt-8">
            {filteredRequests.map((request, index) => (
              <ResultCard
                order={index + 1}
                data={request}
                key={index + 1}
                isExpanded={expandedId === request["Номер Обращения"]}
                onToggle={() => {
                  if (appliedStudent !== "all" && appliedQuestion !== "") {
                    setExpandedId(
                      expandedId === request["Номер Обращения"]
                        ? null
                        : request["Номер Обращения"]
                    );
                  }
                }}
                canToggle={canToggle}
              />
            ))}
          </div>
        </Container>
      </main>
    </div>
  );
}

export default TheUiWrapper;
