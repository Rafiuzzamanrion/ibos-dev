"use client";

import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BasicInfoFormData } from "@/schemas/examSchema";

interface StepBasicInfoProps {
  form: UseFormReturn<BasicInfoFormData>;
}

export function StepBasicInfo({ form }: StepBasicInfoProps) {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = form;

  return (
    <div className="space-y-6">
      <h3 className="text-base font-semibold">Basic Information</h3>

      <div>
        <Label htmlFor="title">
          Online Test Title <span className="text-red-500">*</span>
        </Label>
        <Input
          id="title"
          placeholder="Enter online test title"
          {...register("title")}
          className="mt-2"
        />
        {errors.title && (
          <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <Label htmlFor="totalCandidates">
            Total Candidates <span className="text-red-500">*</span>
          </Label>
          <Input
            id="totalCandidates"
            type="number"
            placeholder="Enter total candidates"
            {...register("totalCandidates", { valueAsNumber: true })}
            className="mt-2"
          />
          {errors.totalCandidates && (
            <p className="mt-1 text-xs text-red-500">
              {errors.totalCandidates.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="totalSlots">
            Total Slots <span className="text-red-500">*</span>
          </Label>
          <Select
            value={watch("totalSlots")?.toString() || ""}
            onValueChange={(value) => setValue("totalSlots", parseInt(value))}
          >
            <SelectTrigger id="totalSlots" className="mt-2">
              <SelectValue placeholder="Select total shots" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map((slot) => (
                <SelectItem key={slot} value={slot.toString()}>
                  {slot}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.totalSlots && (
            <p className="mt-1 text-xs text-red-500">
              {errors.totalSlots.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <Label htmlFor="totalQuestionSets">
            Total Question Set <span className="text-red-500">*</span>
          </Label>
          <Select
            value={watch("totalQuestionSets")?.toString() || ""}
            onValueChange={(value) =>
              setValue("totalQuestionSets", parseInt(value))
            }
          >
            <SelectTrigger id="totalQuestionSets" className="mt-2">
              <SelectValue placeholder="Select total question set" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map((set) => (
                <SelectItem key={set} value={set.toString()}>
                  {set}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.totalQuestionSets && (
            <p className="mt-1 text-xs text-red-500">
              {errors.totalQuestionSets.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="questionType">
            Question Type <span className="text-red-500">*</span>
          </Label>
          <Select
            value={watch("questionType") || ""}
            onValueChange={(value) => setValue("questionType", value)}
          >
            <SelectTrigger id="questionType" className="mt-2">
              <SelectValue placeholder="Select question type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="radio">MCQ</SelectItem>
              <SelectItem value="checkbox">Checkbox</SelectItem>
              <SelectItem value="text">Text</SelectItem>
            </SelectContent>
          </Select>
          {errors.questionType && (
            <p className="mt-1 text-xs text-red-500">
              {errors.questionType.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div>
          <Label htmlFor="startTime">
            Start Time <span className="text-red-500">*</span>
          </Label>
          <Input
            id="startTime"
            type="datetime-local"
            {...register("startTime")}
            className="mt-2"
          />
          {errors.startTime && (
            <p className="mt-1 text-xs text-red-500">
              {errors.startTime.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="endTime">
            End Time <span className="text-red-500">*</span>
          </Label>
          <Input
            id="endTime"
            type="datetime-local"
            {...register("endTime")}
            className="mt-2"
          />
          {errors.endTime && (
            <p className="mt-1 text-xs text-red-500">
              {errors.endTime.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="duration">Duration</Label>
          <Input
            id="duration"
            type="number"
            placeholder="Duration Time"
            {...register("duration", { valueAsNumber: true })}
            className="mt-2"
          />
          {errors.duration && (
            <p className="mt-1 text-xs text-red-500">
              {errors.duration.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
