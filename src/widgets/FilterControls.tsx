import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { Label } from "../components/ui/label";
import { useMemo, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/shared/utils/cn";

interface FilterControlsProps {
  selectedStudentName: string;
  onStudentChange: (value: string) => void;
  studentOptions: string[];
  questionOptions: string[];
  onQuestionChange: (value: string) => void;
  selectedQuestion: string;
}

function FilterControls({
  selectedStudentName,
  onStudentChange,
  studentOptions,
  questionOptions,
  onQuestionChange,
  selectedQuestion,
}: FilterControlsProps) {
  const [studentSearch, setStudentSearch] = useState("");
  const [openStudent, setOpenStudent] = useState(false);
  const [openQuestion, setOpenQuestion] = useState(false);
  const [questionSearch, setQuestionSearch] = useState("");

  const filteredStudentOptions = useMemo(() => {
    if (!studentSearch) return studentOptions;

    return studentOptions.filter((student) =>
      student.toLowerCase().includes(studentSearch.toLowerCase())
    );
  }, [studentOptions, studentSearch]);

  const filteredQuestionOptions = useMemo(() => {
    if (!questionSearch) return questionOptions.slice(0, 50);

    const filtered = questionOptions.filter((question) =>
      question.toLowerCase().includes(questionSearch.toLowerCase())
    );

    return filtered.slice(0, 50);
  }, [questionOptions, questionSearch]);

  return (
    <div className="rounded-lg border border-border bg-card p-6 mt-6">
      <h2 className="mb-4 text-lg font-medium text-foreground">
        Filter Student Requests
      </h2>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="fullname-filter space-y-2">
          <Label
            htmlFor="student"
            className="text-sm font-medium text-foreground">
            Student Name
          </Label>

          <Popover open={openStudent} onOpenChange={setOpenStudent}>
            <PopoverTrigger asChild>
              <Button
                id="student"
                variant="outline"
                role="combobox"
                aria-expanded={openStudent}
                className="w-full justify-between bg-transparent">
                {selectedStudentName === "all"
                  ? "All Students"
                  : selectedStudentName}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-72 p-0" align="start">
              <Command shouldFilter={false}>
                <CommandInput
                  placeholder="Search question..."
                  value={studentSearch}
                  onValueChange={setStudentSearch}
                />

                <CommandList>
                  <CommandEmpty>
                    {studentSearch
                      ? "No student found."
                      : "Type to search students..."}
                  </CommandEmpty>

                  <CommandGroup>
                    <CommandItem
                      value="all"
                      onSelect={() => {
                        onStudentChange("all");
                        setOpenStudent(false);
                        setStudentSearch("");
                      }}>
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedStudentName === "all"
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      All Students
                    </CommandItem>
                    {filteredStudentOptions.map((student) => (
                      <CommandItem
                        key={student}
                        value={student}
                        onSelect={(currentValue) => {
                          onStudentChange(
                            currentValue === selectedStudentName
                              ? "all"
                              : currentValue
                          );
                          setOpenStudent(false);
                          setStudentSearch("");
                        }}>
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedStudentName === student
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {student}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="question-text-filter space-y-2">
          <Label
            htmlFor="student"
            className="text-sm font-medium text-foreground">
            Question
            {selectedStudentName !== "all" && (
              <span className="ml-2 text-xs text-muted-foreground">
                (filtered by selected student)
              </span>
            )}
          </Label>

          <Popover open={openQuestion} onOpenChange={setOpenQuestion}>
            <PopoverTrigger asChild>
              <Button
                id="student"
                variant="outline"
                role="combobox"
                aria-expanded={openQuestion}
                className="w-full justify-between bg-transparent">
                <span className="truncate">
                  {selectedQuestion === "all"
                    ? "All Questions"
                    : selectedQuestion}
                </span>

                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-96 p-0" align="start">
              <Command shouldFilter={false}>
                <CommandInput
                  placeholder="Search question..."
                  value={questionSearch}
                  onValueChange={setQuestionSearch}
                />

                <CommandList>
                  <CommandEmpty>
                    {questionSearch
                      ? "No question found."
                      : "Type to search questions..."}
                  </CommandEmpty>

                  <CommandGroup>
                    <CommandItem
                      value="all"
                      onSelect={() => {
                        onQuestionChange("all");
                        setOpenQuestion(false);
                        setQuestionSearch("");
                      }}>
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedQuestion === "all"
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      All Questions
                    </CommandItem>

                    {filteredQuestionOptions.map((question) => (
                      <CommandItem
                        key={question}
                        value={question}
                        onSelect={(currentValue) => {
                          onQuestionChange(
                            currentValue === selectedQuestion
                              ? "all"
                              : currentValue
                          );
                          setOpenQuestion(false);
                          setQuestionSearch("");
                        }}>
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedQuestion === question
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {question}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}

export default FilterControls;
