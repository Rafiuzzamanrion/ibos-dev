"use client";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RichTextEditor } from "@/components/shared/RichTextEditor";
import { Plus, Trash2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { questionFormSchema, QuestionFormData } from "@/schemas/examSchema";
import { IQuestionForm } from "@/types/question.types";

interface QuestionModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: IQuestionForm) => void;
  onSaveAndAddMore: (data: IQuestionForm) => void;
  editingQuestion?: IQuestionForm | null;
  questionNumber: number;
}

export function QuestionModal({
  open,
  onClose,
  onSave,
  onSaveAndAddMore,
  editingQuestion,
  questionNumber,
}: QuestionModalProps) {
  const form = useForm<QuestionFormData>({
    resolver: zodResolver(questionFormSchema),
    defaultValues: {
      title: "",
      type: "radio",
      score: 1,
      options: [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "options",
  });

  const questionType = form.watch("type");
  const titleValue = form.watch("title");

  useEffect(() => {
    if (editingQuestion) {
      form.reset({
        title: editingQuestion.title,
        type: editingQuestion.type,
        score: editingQuestion.score,
        options: editingQuestion.options,
      });
    } else {
      form.reset({
        title: "",
        type: "radio",
        score: 1,
        options: [
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
        ],
      });
    }
  }, [editingQuestion, form, open]);

  function handleSetCorrectAnswer(optionIndex: number) {
    const currentType = form.getValues("type");
    const currentOptions = form.getValues("options") || [];

    if (currentType === "radio") {
      currentOptions.forEach((_, i) => {
        form.setValue(`options.${i}.isCorrect`, i === optionIndex);
      });
    } else {
      const current = form.getValues(`options.${optionIndex}.isCorrect`);
      form.setValue(`options.${optionIndex}.isCorrect`, !current);
    }
  }

  function buildFormData(data: QuestionFormData): IQuestionForm {
    return {
      title: data.title,
      type: data.type,
      score: data.score,
      options:
        data.type === "text"
          ? []
          : (data.options || []).map((opt) => ({
              text: opt.text,
              isCorrect: opt.isCorrect,
            })),
    };
  }

  function handleSave(data: QuestionFormData) {
    onSave(buildFormData(data));
  }

  function handleSaveAndMore(data: QuestionFormData) {
    onSaveAndAddMore(buildFormData(data));
    form.reset({
      title: "",
      type: "radio",
      score: 1,
      options: [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ],
    });
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] w-full max-w-2xl sm:max-w-3xl overflow-x-hidden overflow-y-auto p-6" showCloseButton={false}>
        <DialogHeader className="mb-2 border-b pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-3 text-lg font-semibold text-gray-900">
              <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-gray-300 text-sm font-medium text-gray-500">
                {questionNumber}
              </span>
              Question {questionNumber}
            </DialogTitle>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">Score:</span>
                <Input
                  type="number"
                  className="h-10 w-20 text-center text-sm font-medium"
                  {...form.register("score", { valueAsNumber: true })}
                />
              </div>
              <Select
                value={questionType}
                onValueChange={(value) => {
                  const val = value as "radio" | "checkbox" | "text";
                  form.setValue("type", val, { shouldValidate: true });
                  if (val === "text") {
                    form.clearErrors("options");
                  }
                }}
              >
                <SelectTrigger className="h-10 w-36 text-sm font-medium">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="radio">Radio</SelectItem>
                  <SelectItem value="checkbox">Checkbox</SelectItem>
                  <SelectItem value="text">Text</SelectItem>
                </SelectContent>
              </Select>
              
              <button
                type="button"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                title="Delete Question"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </DialogHeader>

        <form className="space-y-4">
          <div>
            <RichTextEditor
              value={titleValue}
              onChange={(value) => form.setValue("title", value, { shouldValidate: true })}
              placeholder="Enter question title..."
              minHeight="100px"
            />
            {form.formState.errors.title && (
              <p className="mt-1 text-xs text-red-500">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>

          {questionType !== "text" && (
            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="space-y-2">
                  <div className="flex items-center gap-3 bg-white p-2 border-b border-transparent transition-colors">
                    <span className="flex-shrink-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-gray-300 text-sm font-medium text-gray-500">
                      {String.fromCharCode(65 + index)}
                    </span>

                    <div className="flex flex-1 items-center gap-2">
                      {questionType === "checkbox" ? (
                        <Checkbox
                          checked={form.watch(`options.${index}.isCorrect`)}
                          onCheckedChange={() => handleSetCorrectAnswer(index)}
                          id={`option-correct-${index}`}
                          className="h-5 w-5"
                        />
                      ) : (
                        <RadioGroup
                          value={form.watch(`options.${index}.isCorrect`) ? "true" : "false"}
                        >
                          <RadioGroupItem
                            value="true"
                            onClick={() => handleSetCorrectAnswer(index)}
                            id={`option-correct-${index}`}
                            className="h-5 w-5"
                          />
                        </RadioGroup>
                      )}

                      <Label
                        htmlFor={`option-correct-${index}`}
                        className="text-sm font-medium text-foreground cursor-pointer select-none"
                      >
                        Set as correct answer
                      </Label>
                    </div>

                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="ml-auto flex shrink-0 items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors"
                      title="Remove Option"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="ml-[42px]">
                    <RichTextEditor
                      value={form.watch(`options.${index}.text`) || ""}
                      onChange={(value) =>
                        form.setValue(`options.${index}.text`, value)
                      }
                      placeholder={`Option ${String.fromCharCode(65 + index)} text...`}
                      minHeight="60px"
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => append({ text: "", isCorrect: false })}
                className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
              >
                <Plus className="h-4 w-4" />
                Another options
              </button>
              {form.formState.errors.options && (
                <p className="mt-1 text-xs text-red-500">
                  {form.formState.errors.options.root?.message || form.formState.errors.options.message}
                </p>
              )}
            </div>
          )}

          {questionType === "text" && (
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="flex-shrink-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-gray-300 text-sm font-medium text-gray-500">
                  A
                </span>
              </div>
              <div className="pointer-events-none opacity-60">
                <RichTextEditor
                  value=""
                  onChange={() => {}}
                  placeholder="Sample answer (for reference)..."
                  minHeight="60px"
                />
              </div>
            </div>
          )}

          {Object.keys(form.formState.errors).length > 0 && (
            <div className="rounded-md border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-semibold text-red-600 mb-2">Form Errors (Debug):</p>
              <pre className="text-xs text-red-700 whitespace-pre-wrap font-mono">
                {JSON.stringify(form.formState.errors, null, 2)}
              </pre>
            </div>
          )}
          <div className="flex items-center justify-center gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              className="w-36 border-primary text-primary hover:bg-primary/5"
              onClick={form.handleSubmit(handleSave)}
              id="save-question-button"
            >
              Save
            </Button>
            <Button
              type="button"
              className="w-44 bg-primary text-white hover:bg-primary/90"
              onClick={form.handleSubmit(handleSaveAndMore)}
              id="save-and-add-more-button"
            >
              Save & Add More
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
