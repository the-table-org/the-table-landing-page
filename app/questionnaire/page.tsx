"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EnhancedPhoneInput } from "@/components/questionnaire/phone-input";
import { SelectOption } from "@/components/questionnaire/select-option";
import { supabase } from "@/lib/supabase";

interface QuestionOption {
  id: string;
  value: string;
  label: string;
  order: number;
}

interface Section {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  order: number;
}

interface Question {
  id: string;
  slug: string;
  label: string;
  type: "text" | "textarea" | "phone_input" | "select" | "multi-select";
  required?: boolean;
  placeholder?: string;
  group?: string;
  description?: string;
  order: number;
  section_id: string;
  application_question_options?: QuestionOption[];
}

type Step =
  | { type: "section"; sectionIndex: number }
  | { type: "question"; questionIndex: number };

// LinkedIn URL validation
export function isLikelyLinkedInUrl(input: string): boolean {
  try {
    const u = new URL(input.trim());
    if (u.protocol !== "https:" && u.protocol !== "http:") return false;
    const host = u.hostname.toLowerCase();
    const hostOk = host === "linkedin.com" || host.endsWith(".linkedin.com");
    if (!hostOk) return false;
    const p = u.pathname.replace(/\/+$/, "");
    if (!/^\/(in|company|school|pub)\//i.test(p)) return false;
    return true;
  } catch {
    return false;
  }
}

export default function QuestionnairePage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phoneValidation, setPhoneValidation] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Fetch questions and sections from Supabase
  useEffect(() => {
    const fetchQuestionsAndSections = async () => {
      try {
        const [questionsResponse, sectionsResponse] = await Promise.all([
          supabase
            .from("application_questions")
            .select("*, application_question_options(*)")
            .order("order", { ascending: true }),
          supabase
            .from("application_sections")
            .select("*")
            .order("order", { ascending: true }),
        ]);

        if (questionsResponse.error) throw questionsResponse.error;
        if (sectionsResponse.error) throw sectionsResponse.error;

        if (questionsResponse.data && sectionsResponse.data) {
          const sortedSections = sectionsResponse.data.sort((a, b) => a.order - b.order);
          setSections(sortedSections);

          const sectionOrderMap = new Map();
          sortedSections.forEach((section, index) => {
            sectionOrderMap.set(section.id, index);
          });

          const sortedQuestions = questionsResponse.data
            .map((question) => ({
              ...question,
              application_question_options:
                question.application_question_options?.sort(
                  (a: QuestionOption, b: QuestionOption) => a.order - b.order
                ) || [],
            }))
            .sort((a, b) => {
              const sectionOrderA = sectionOrderMap.get(a.section_id) ?? 999;
              const sectionOrderB = sectionOrderMap.get(b.section_id) ?? 999;

              if (sectionOrderA !== sectionOrderB) {
                return sectionOrderA - sectionOrderB;
              }

              return a.order - b.order;
            });

          setQuestions(sortedQuestions);

          const stepsArray: Step[] = [];
          sortedSections.forEach((section, sectionIdx) => {
            stepsArray.push({ type: "section", sectionIndex: sectionIdx });

            sortedQuestions.forEach((question, questionIdx) => {
              if (question.section_id === section.id) {
                stepsArray.push({ type: "question", questionIndex: questionIdx });
              }
            });
          });

          setSteps(stepsArray);
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestionsAndSections();
  }, []);

  const updateAnswer = useCallback((slug: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [slug]: value }));
  }, []);

  const handleNext = async () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((s) => s + 1);
    } else {
      await handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((s) => s - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Placeholder submission logic
      console.log("Submitting answers:", answers);
      
      // TODO: Implement actual submission to Supabase
      // This will be implemented once you show the questionnaire structure
      
      // For now, just log and redirect
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      alert("Application submitted successfully!");
      router.push("/");
    } catch (error) {
      console.error("Submission error:", error);
      alert("There was an error submitting your application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isCurrentStepValid = () => {
    const currentStep = steps[currentStepIndex];
    if (!currentStep) return false;

    if (currentStep.type === "section") return true;

    const currentQuestion = questions[currentStep.questionIndex];
    if (!currentQuestion) return false;

    const answer = answers[currentQuestion.slug];

    // LinkedIn validation
    if (
      currentQuestion.type === "text" &&
      currentQuestion.slug?.toLowerCase().includes("linkedin")
    ) {
      return typeof answer === "string" && isLikelyLinkedInUrl(answer);
    }

    // Phone validation
    if (currentQuestion.type === "phone_input") {
      if (!answer || answer.toString().trim().length === 0) return false;
      const isValid = phoneValidation[currentQuestion.slug];
      return isValid !== false;
    }

    // Multi-select validation
    if (currentQuestion.type === "multi-select") {
      return Array.isArray(answer) && answer.length > 0;
    }

    // General validation
    return answer && answer.toString().trim().length > 0;
  };

  const renderInput = (question: Question) => {
    const value = answers[question.slug] || "";

    switch (question.type) {
      case "text": {
        const isLinkedIn = question.slug?.toLowerCase().includes("linkedin");
        return (
          <Input
            value={value}
            onChange={(e) => updateAnswer(question.slug, e.target.value)}
            placeholder={
              question.placeholder ||
              (isLinkedIn
                ? "https://www.linkedin.com/in/username"
                : `Enter ${question.label.toLowerCase()}`)
            }
            autoCapitalize={isLinkedIn ? "none" : undefined}
            autoCorrect={isLinkedIn ? "off" : undefined}
            type={isLinkedIn ? "url" : "text"}
          />
        );
      }
      case "textarea":
        return (
          <Textarea
            value={value}
            onChange={(e) => updateAnswer(question.slug, e.target.value)}
            placeholder={
              question.placeholder || `Tell us about ${question.label.toLowerCase()}`
            }
            rows={5}
            className="resize-none"
          />
        );
      case "phone_input":
        return (
          <EnhancedPhoneInput
            value={value}
            onChangeText={(v) => updateAnswer(question.slug, v)}
            onValidationChange={(isValid) => {
              setPhoneValidation((prev) => ({
                ...prev,
                [question.slug]: isValid,
              }));
            }}
            placeholder={question.placeholder || "Enter phone number"}
          />
        );
      case "select":
        return (
          <div className="space-y-2">
            {question.application_question_options?.map((opt) => (
              <SelectOption
                key={opt.value}
                option={opt}
                isSelected={value === opt.value}
                onPress={() => updateAnswer(question.slug, opt.value)}
              />
            ))}
          </div>
        );
      case "multi-select": {
        const selected = new Set(Array.isArray(value) ? value : []);
        return (
          <div className="space-y-2">
            {question.application_question_options?.map((opt) => {
              const isSelected = selected.has(opt.value);
              return (
                <SelectOption
                  key={opt.value}
                  option={opt}
                  isSelected={isSelected}
                  onPress={() => {
                    const next = isSelected
                      ? Array.from(selected).filter((v) => v !== opt.value)
                      : [...selected, opt.value];
                    updateAnswer(question.slug, next);
                  }}
                />
              );
            })}
          </div>
        );
      }
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen bg-background font-sans flex items-center justify-center p-8 overflow-hidden">
        <div className="flex gap-4 h-[95dvh] w-full">
          {/* Left Side - Hero Image */}
          <div className="relative bg-primary p-6 lg:p-8 flex flex-col justify-between rounded-3xl w-2/5 overflow-hidden border border-border/50">
            <div className="absolute inset-0">
              <Image
                src="/community-meeting.png"
                alt="Community gathering"
                fill
                className="object-cover opacity-60"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60"></div>
            <div className="flex items-start relative z-10">
              <Link href="/">
                <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20 cursor-pointer hover:bg-white/20 transition-colors">
                  <Image src="/logo.png" alt="The Table Logo" width={24} height={24} />
                </div>
              </Link>
            </div>
          </div>

          {/* Right Side - Loading */
          <div className="p-8 flex flex-col justify-center items-center bg-white rounded-3xl w-3/5 border border-border/50">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-muted-foreground">Loading questionnaire...</p>
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0 || steps.length === 0) {
    return (
      <div className="h-screen bg-background font-sans flex items-center justify-center p-8 overflow-hidden">
        <div className="flex gap-4 h-[95dvh] w-full">
          {/* Left Side - Hero Image */}
          <div className="relative bg-primary p-6 lg:p-8 flex flex-col justify-between rounded-3xl w-2/5 overflow-hidden border border-border/50">
            <div className="absolute inset-0">
              <Image
                src="/community-meeting.png"
                alt="Community gathering"
                fill
                className="object-cover opacity-60"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60"></div>
            <div className="flex items-start relative z-10">
              <Link href="/">
                <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20 cursor-pointer hover:bg-white/20 transition-colors">
                  <Image src="/logo.png" alt="The Table Logo" width={24} height={24} />
                </div>
              </Link>
            </div>
          </div>

          {/* Right Side - Error */
          <div className="p-8 flex flex-col justify-center items-center bg-white rounded-3xl w-3/5 border border-border/50">
            <p className="text-foreground text-lg mb-4">No questions available</p>
            <Button onClick={() => router.push("/")}>Return Home</Button>
          </div>
        </div>
      </div>
    );
  }

  const currentStep = steps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  // Render section introduction screen
  if (currentStep.type === "section") {
    const section = sections[currentStep.sectionIndex];

    return (
      <div className="h-screen bg-background font-sans flex items-center justify-center p-8 overflow-hidden">
        <div className="flex gap-4 h-[95dvh] w-full">
          {/* Left Side - Hero Image */}
          <div className="relative bg-primary p-6 lg:p-8 flex flex-col justify-between rounded-3xl w-2/5 overflow-hidden border border-border/50">
            <div className="absolute inset-0">
              <Image
                src="/community-meeting.png"
                alt="Community gathering"
                fill
                className="object-cover opacity-60"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60"></div>
            <div className="flex items-start relative z-10">
              <Link href="/">
                <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20 cursor-pointer hover:bg-white/20 transition-colors">
                  <Image src="/logo.png" alt="The Table Logo" width={24} height={24} />
                </div>
              </Link>
            </div>
          </div>

          {/* Right Side - Section Introduction */
          <div className="p-8 flex flex-col justify-between bg-white rounded-3xl overflow-y-auto w-3/5 border border-border/50">
            <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto">
              <div className="text-center space-y-6">
                {section.icon && <div className="text-6xl">{section.icon}</div>}
                <h1 className="text-4xl font-serif font-semibold text-foreground leading-tight">
                  {section.title}
                </h1>
                {section.description && (
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {section.description}
                  </p>
                )}
              </div>

              <div className="flex justify-center mt-12">
                <Button size="lg" onClick={handleNext}>
                  Continue
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render question screen
  const currentQuestion = questions[currentStep.questionIndex];
  const currentSection = sections.find((s) => s.id === currentQuestion?.section_id);
  const questionsInCurrentSection = questions.filter(
    (q) => q.section_id === currentQuestion?.section_id
  );
  const currentQuestionIndexInSection =
    questionsInCurrentSection.findIndex((q) => q.id === currentQuestion?.id) + 1;
  const totalQuestionsInSection = questionsInCurrentSection.length;

  if (!currentQuestion) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background font-sans flex items-center justify-center p-8 overflow-hidden">
      <div className="flex gap-4 h-[95dvh] w-full">
        {/* Left Side - Hero Image */}
        <div className="relative bg-primary p-6 lg:p-8 flex flex-col justify-between rounded-3xl w-2/5 overflow-hidden border border-border/50">
          <div className="absolute inset-0">
            <Image
              src="/community-meeting.png"
              alt="Community gathering"
              fill
              className="object-cover opacity-60"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60"></div>
          <div className="flex items-start relative z-10">
            <Link href="/">
              <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20 cursor-pointer hover:bg-white/20 transition-colors">
                <Image src="/logo.png" alt="The Table Logo" width={24} height={24} />
              </div>
            </Link>
          </div>
        </div>

        {/* Right Side - Question Form */
        <div className="p-8 flex flex-col bg-white rounded-3xl w-3/5 border border-border/50 overflow-hidden">
          <div className="max-w-xl mx-auto w-full flex flex-col h-full">
            {/* Header with section badge and progress - Fixed */}
            <div className="flex items-center justify-between mb-8 flex-shrink-0">
              <div className="bg-muted px-4 py-2 rounded-full">
                <span className="text-sm font-semibold text-primary">
                  {currentSection?.title || "Section"}
                </span>
              </div>

              <div className="flex items-center rounded-full overflow-hidden bg-muted">
                <div className="px-4 py-2 border-r border-primary/30">
                  <span className="text-sm font-normal text-primary/70">
                    {currentQuestionIndexInSection}
                  </span>
                </div>
                <div className="px-4 py-2">
                  <span className="text-sm font-bold text-primary">
                    {totalQuestionsInSection}
                  </span>
                </div>
              </div>
            </div>

            {/* Question title - Fixed */}
            <div className="flex-shrink-0">
              {currentQuestion.group && (
                <div className="mb-3">
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                    {currentQuestion.group}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h2 className="text-3xl font-serif font-semibold text-foreground mb-3 leading-tight">
                  {currentQuestion.label}
                  {currentQuestion.required && <span className="text-destructive"> *</span>}
                </h2>
                {currentQuestion.description && (
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {currentQuestion.description}
                  </p>
                )}
              </div>
            </div>

            {/* Scrollable input area */}
            <div className="flex-1 overflow-y-auto min-h-0 mb-6">
              <div>{renderInput(currentQuestion)}</div>
            </div>

            {/* Footer with navigation - Fixed */}
            <div className="pt-6 border-t border-border border-dashed flex-shrink-0">
              <div className="flex items-center justify-between gap-4">
                {currentStepIndex > 0 ? (
                  <Button onClick={handleBack} variant="outline" size="lg">
                    <ChevronLeft className="w-5 h-5" />
                    Back
                  </Button>
                ) : (
                  <div />
                )}

                <Button
                  onClick={handleNext}
                  disabled={!isCurrentStepValid() || isSubmitting}
                  size="lg"
                >
                  {isSubmitting
                    ? "Submitting..."
                    : currentStepIndex === steps.length - 1
                      ? "Submit Application"
                      : "Continue"}
                  {!isSubmitting && <ChevronRight className="w-5 h-5" />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
