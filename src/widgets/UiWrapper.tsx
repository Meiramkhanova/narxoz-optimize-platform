"use client";

import { RequestRow } from "@/app/page";
import { useMemo, useState } from "react";
import FilterControls from "../widgets/FilterControls";
import Header from "../widgets/Header";
import Container from "@/shared/ui/Container";
import ResultCard from "@/widgets/components/ResultCard";

interface UiWrapperProps {
  typedRows: RequestRow[];
}

function UiWrapper({ typedRows }: UiWrapperProps) {
  const [selectedStudentName, setSelectedStudentName] = useState<string>("all");
  const [selectedQuestion, setSelectedQuestion] = useState<string>("all");

  const [appliedStudent, setAppliedStudent] = useState<string>("all");
  const [appliedQuestion, setAppliedQuestion] = useState<string>("all");

  const studentOptions = useMemo(() => {
    return Array.from(new Set(typedRows.map((r) => r.ФИО))).sort();
  }, [typedRows]);

  const questionOptions = useMemo(() => {
    let relevantRequests = typedRows;

    if (selectedStudentName !== "all") {
      relevantRequests = typedRows.filter((req) => {
        return selectedStudentName === req.ФИО;
      });
    }

    const uniqueQuestions = new Set(relevantRequests.map((req) => req.Вопрос));

    return Array.from(uniqueQuestions).sort();
  }, [selectedStudentName]);

  const filteredData = useMemo(() => {
    return typedRows.filter((item) => {
      const fullName = item.ФИО;
      const studentMatch =
        selectedStudentName === "all" || selectedStudentName === fullName;
      const questionMatch =
        selectedQuestion === "all" || selectedQuestion === item.Вопрос;
      return studentMatch && questionMatch;
    });
  }, [selectedStudentName, selectedQuestion]);

  const handleStudentChange = (value: string) => {
    setSelectedStudentName(value);
    setSelectedQuestion("all");
  };

  const handleQuestionChange = (value: string) => {
    setSelectedQuestion(value);
  };

  console.log("filteredData", filteredData);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="py-6">
        <Container>
          <FilterControls
            selectedStudentName={selectedStudentName}
            onStudentChange={handleStudentChange}
            onQuestionChange={handleQuestionChange}
            studentOptions={studentOptions}
            questionOptions={questionOptions}
            selectedQuestion={selectedQuestion}
          />

          <div className="results-count mb-6 mt-8">
            <p className="text-sm text-muted-foreground">
              Showing {filteredData.length}{" "}
              {filteredData.length === 1 ? "request" : "requests"}
            </p>
          </div>

          <div className="filtered-results grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.map((item, index) => (
              <ResultCard key={index} order={index + 1} data={item} />
            ))}
          </div>

          {filteredData.length === 0 && (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 px-4 py-12">
              <p className="text-lg font-medium text-foreground">
                No requests found
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Try adjusting your filters to see more results
              </p>
            </div>
          )}
        </Container>
      </main>
    </div>
  );
}

export default UiWrapper;
