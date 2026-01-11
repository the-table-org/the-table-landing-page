"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Spinner,
  XCircle,
} from "@mynaui/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { EnhancedPhoneInput } from "@/components/questionnaire/phone-input";
import { SelectOption } from "@/components/questionnaire/select-option";
import { supabase } from "@/lib/supabase";
import QRCode from "react-qr-code";

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

interface QuestionnaireModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  userId: string | null;
}

function isLikelyLinkedInUrl(input: string): boolean {
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

export function QuestionnaireModal({
  isOpen,
  onClose,
  userEmail,
  userId,
}: QuestionnaireModalProps) {
  console.log("[QuestionnaireModal] Render - isOpen:", isOpen);

  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [phoneValidation, setPhoneValidation] = useState<
    Record<string, boolean>
  >({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);

  useEffect(() => {
    console.log("[QuestionnaireModal] useEffect triggered - isOpen:", isOpen);
    if (!isOpen) return;

    console.log("[QuestionnaireModal] Setting loading to true");
    setIsLoading(true);

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
          const sortedSections = sectionsResponse.data.sort(
            (a, b) => a.order - b.order,
          );
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
                  (a: QuestionOption, b: QuestionOption) => a.order - b.order,
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
                stepsArray.push({
                  type: "question",
                  questionIndex: questionIdx,
                });
              }
            });
          });

          setSteps(stepsArray);
          console.log("[QuestionnaireModal] Steps set:", stepsArray.length);
        }
      } catch (error) {
        console.error("[QuestionnaireModal] Error fetching questions:", error);
      } finally {
        console.log("[QuestionnaireModal] Setting loading to false");
        setIsLoading(false);
      }
    };

    fetchQuestionsAndSections();
  }, [isOpen]);

  const updateAnswer = useCallback((slug: string, value: string | string[]) => {
    console.log(
      "[QuestionnaireModal] updateAnswer called - slug:",
      slug,
      "value:",
      value,
    );
    setAnswers((prev) => ({ ...prev, [slug]: value }));
  }, []);

  const handleNext = async () => {
    console.log(
      "[QuestionnaireModal] handleNext - currentStepIndex:",
      currentStepIndex,
      "totalSteps:",
      steps.length,
    );
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

  const buildApplicationData = () => {
    const applicationData: any = {
      questions: [],
      submitted_at: new Date().toISOString(),
    };

    for (const question of questions) {
      const answer = answers[question.slug];
      const section = sections.find((s) => s.id === question.section_id);

      const questionSnapshot = {
        id: question.id,
        slug: question.slug,
        label: question.label,
        type: question.type,
        required: question.required || false,
        placeholder: question.placeholder,
        group: question.group,
        description: question.description,
        order: question.order,
        section: section
          ? {
              id: section.id,
              title: section.title,
              description: section.description,
              order: section.order,
            }
          : null,
      };

      const answerData: any = {
        type: question.type,
        value: answer,
      };

      if (question.type === "select" && answer) {
        const selectedOption = question.application_question_options?.find(
          (opt) => opt.value === answer,
        );
        if (selectedOption) {
          answerData.selected_option = {
            value: selectedOption.value,
            label: selectedOption.label,
          };
        }
      } else if (question.type === "multi-select" && Array.isArray(answer)) {
        const selectedOptions = question.application_question_options
          ?.filter((opt) => answer.includes(opt.value))
          .map((opt) => ({
            value: opt.value,
            label: opt.label,
          }));
        answerData.selected_options = selectedOptions || [];
      }

      applicationData.questions.push({
        question: questionSnapshot,
        answer: answerData,
      });
    }

    return applicationData;
  };

  const handleSubmit = async () => {
    setSubmitStatus("loading");

    try {
      if (!userId) {
        throw new Error("User ID is required to submit the application");
      }

      const applicationData = buildApplicationData();

      const { data: applicationRecord, error: appError } = await supabase
        .from("applications")
        .insert({ user_id: userId })
        .select("id")
        .single();

      if (appError) throw appError;

      const { error: answersError } = await supabase
        .from("application_answers")
        .insert({
          application_id: applicationRecord.id,
          data: applicationData,
        });

      if (answersError) throw answersError;

      await supabase.auth.updateUser({
        data: {
          is_email_verified: true,
          status: "pending",
        },
      });

      setSubmitStatus("success");

      setTimeout(() => {
        router.push("/success");
      }, 1000);
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus("idle"), 3000);
    }
  };

  const isCurrentStepValid = () => {
    const currentStep = steps[currentStepIndex];
    if (!currentStep) return false;

    if (currentStep.type === "section") return true;

    const currentQuestion = questions[currentStep.questionIndex];
    if (!currentQuestion) return false;

    const answer = answers[currentQuestion.slug];

    if (
      currentQuestion.type === "text" &&
      currentQuestion.slug?.toLowerCase().includes("linkedin")
    ) {
      return typeof answer === "string" && isLikelyLinkedInUrl(answer);
    }

    if (currentQuestion.type === "phone_input") {
      if (!answer || answer.toString().trim().length === 0) return false;
      const isValid = phoneValidation[currentQuestion.slug];
      return isValid !== false;
    }

    if (currentQuestion.type === "multi-select") {
      return Array.isArray(answer) && answer.length > 0;
    }

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
              question.placeholder ||
              `Tell us about ${question.label.toLowerCase()}`
            }
            rows={12}
            className="resize-none h-[200px]"
          />
        );
      case "phone_input":
        return (
          <EnhancedPhoneInput
            value={value as string}
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
          <div className="space-y-2 overflow-y-auto">
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

  const handleClose = () => {
    console.log("[QuestionnaireModal] handleClose called");
    setCurrentStepIndex(0);
    setAnswers({});
    setPhoneValidation({});
    setSubmitStatus("idle");
    setShowSuccessScreen(false);
    setQuestions([]);
    setSections([]);
    setSteps([]);
    setIsLoading(false);
    onClose();
  };

  console.log(
    "[QuestionnaireModal] Render state - isLoading:",
    isLoading,
    "questions:",
    questions.length,
    "steps:",
    steps.length,
    "currentStepIndex:",
    currentStepIndex,
  );

  if (!isOpen) return null;

  if (showSuccessScreen) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent
          className="!w-[95vw] sm:!w-[600px] !max-w-[600px] !h-[90vh] sm:!h-[600px] p-0 bg-muted rounded-xl overflow-hidden flex flex-col"
          showCloseButton={false}
          onInteractOutside={(e) => e.preventDefault()}
        >
          <div className="p-1 flex flex-col h-full">
            <div className="rounded-xl border bg-background flex flex-col h-full overflow-hidden">
              <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-10 py-8 sm:py-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-center space-y-3 mb-8"
                >
                  <DialogTitle className="font-display font-black text-2xl sm:text-3xl text-foreground uppercase tracking-tight">
                    Application Submitted!
                  </DialogTitle>
                  <DialogDescription className="text-base text-muted-foreground leading-relaxed max-w-md">
                    Thank you for applying. We&apos;ll review your application
                    and get back to you soon.
                  </DialogDescription>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-4 text-center"
                >
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">
                      Meanwhile, download The Table App
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Scan the QR code to get started
                    </p>
                  </div>

                  <div className="inline-block p-4 bg-card rounded-xl border border-border">
                    <QRCode
                      value="https://apps.apple.com/app/the-table-app/id6752313205"
                      size={180}
                      level="M"
                      fgColor="#000000"
                      bgColor="#ffffff"
                    />
                  </div>
                </motion.div>
              </div>

              <div className="px-10 py-6 border-t border-border flex-shrink-0">
                <Button onClick={handleClose} className="w-full" size="lg">
                  Close
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (isLoading) {
    console.log("[QuestionnaireModal] Rendering loading state");
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent
          className="!w-[95vw] sm:!w-[600px] !max-w-[600px] !h-[90vh] sm:!h-[600px] p-0 bg-muted rounded-xl overflow-hidden flex flex-col"
          showCloseButton={false}
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogTitle className="sr-only">Loading Questionnaire</DialogTitle>
          <div className="flex flex-col h-full">
            <div className="p-1 h-full">
              <div className="rounded-xl border bg-background p-6 sm:p-12 h-full">
                <div className="flex flex-col items-center justify-center text-center space-y-4 h-full">
                  <Spinner className="h-8 w-8 animate-spin text-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Loading questionnaire...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (questions.length === 0 || steps.length === 0) {
    console.log("[QuestionnaireModal] Rendering no questions state");
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent
          className="!w-[95vw] sm:!w-[600px] p-0 bg-muted rounded-xl"
          showCloseButton={false}
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogTitle className="sr-only">No Questions Available</DialogTitle>
          <div className="flex flex-col">
            <div className="p-1">
              <div className="rounded-xl border bg-background p-6 sm:p-12">
                <div className="flex flex-col items-center justify-center text-center space-y-4">
                  <p className="text-foreground text-lg">
                    No questions available
                  </p>
                  <Button onClick={handleClose}>Close</Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const currentStep = steps[currentStepIndex];
  console.log("[QuestionnaireModal] Current step:", currentStep);

  if (currentStep.type === "section") {
    console.log("[QuestionnaireModal] Rendering section screen");
    const section = sections[currentStep.sectionIndex];

    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent
          className="!w-[95vw] sm:!w-[600px] !max-w-[600px] !h-[90vh] sm:!h-[600px] p-0 bg-muted rounded-xl overflow-hidden flex flex-col"
          showCloseButton={true}
          onInteractOutside={(e) => e.preventDefault()}
        >
          <div className="p-1 flex flex-col h-full">
            <div className="rounded-xl border bg-background flex flex-col h-full overflow-hidden">
              {/* Content Area */}
              <div className="flex-1 flex flex-col justify-center px-6 sm:px-10">
                <div className="space-y-6 max-w-md">
                  {section.icon && (
                    <div className="text-5xl">{section.icon}</div>
                  )}

                  <DialogHeader className="space-y-3">
                    <DialogTitle className="font-display font-black text-2xl sm:text-3xl text-foreground uppercase tracking-tight text-left">
                      {section.title}
                    </DialogTitle>
                    {section.description && (
                      <DialogDescription className="text-base text-muted-foreground leading-relaxed text-left">
                        {section.description}
                      </DialogDescription>
                    )}
                  </DialogHeader>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 sm:px-10 py-4 sm:py-6 border-t border-border flex-shrink-0">
                <div className="flex items-center justify-between gap-4">
                  {currentStepIndex > 0 ? (
                    <Button onClick={handleBack} variant="outline" size="lg">
                      <ChevronLeft className="w-5 h-5 mr-1" />
                      Back
                    </Button>
                  ) : (
                    <div />
                  )}
                  <Button onClick={handleNext} size="lg">
                    Continue
                    <ChevronRight className="w-5 h-5 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const currentQuestion = questions[currentStep.questionIndex];
  console.log(
    "[QuestionnaireModal] Rendering question:",
    currentQuestion?.slug,
    "type:",
    currentQuestion?.type,
  );
  const currentSection = sections.find(
    (s) => s.id === currentQuestion?.section_id,
  );
  const questionsInCurrentSection = questions.filter(
    (q) => q.section_id === currentQuestion?.section_id,
  );
  const currentQuestionIndexInSection =
    questionsInCurrentSection.findIndex((q) => q.id === currentQuestion?.id) +
    1;
  const totalQuestionsInSection = questionsInCurrentSection.length;

  if (!currentQuestion) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent
          className="!w-[95vw] sm:!w-[600px] !max-w-[600px] !h-[90vh] sm:!h-[600px] p-0 bg-muted rounded-xl overflow-hidden flex flex-col"
          showCloseButton={true}
          onInteractOutside={(e) => e.preventDefault()}
        >
        <div className="p-1 flex flex-col h-full">
          <div className="rounded-xl border bg-background flex flex-col h-full overflow-hidden">
            {/* Header */}
            <DialogHeader className="px-4 sm:px-10 pt-4 sm:pt-6 pb-3 sm:pb-4 flex-shrink-0 space-y-0">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <Badge variant="secondary" className="text-xs font-medium">
                  {currentSection?.title || "Section"}
                </Badge>

                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {currentQuestionIndexInSection}
                  </span>
                  <span>/</span>
                  <span>{totalQuestionsInSection}</span>
                </div>
              </div>

              <div>
                {currentQuestion.group && (
                  <div className="mb-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {currentQuestion.group}
                    </span>
                  </div>
                )}

                <DialogTitle className="font-display font-black text-xl sm:text-2xl text-foreground uppercase tracking-tight mb-2">
                  {currentQuestion.label}
                  {currentQuestion.required && (
                    <span className="text-destructive"> *</span>
                  )}
                </DialogTitle>

                {currentQuestion.description && (
                  <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
                    {currentQuestion.description}
                  </DialogDescription>
                )}

                {currentQuestion.type === "multi-select" && (
                  <p className="text-xs text-muted-foreground mt-2 italic">
                    You can select multiple options
                  </p>
                )}
                {currentQuestion.type === "select" && (
                  <p className="text-xs text-muted-foreground mt-2 italic">
                    Select one option
                  </p>
                )}
              </div>
            </DialogHeader>

            {/* Scrollable Content */}
            <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-10 py-2">
              {renderInput(currentQuestion)}
            </div>

            {/* Footer */}
            <div className="px-4 sm:px-10 py-4 sm:py-6 border-t border-border flex-shrink-0">
              <div className="flex items-center justify-between gap-2 sm:gap-4">
                {currentStepIndex > 0 ? (
                  <Button onClick={handleBack} variant="outline" size="lg" className="text-sm sm:text-base">
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1" />
                    Back
                  </Button>
                ) : (
                  <div />
                )}

                <Button
                  onClick={handleNext}
                  disabled={!isCurrentStepValid() || submitStatus === "loading"}
                  size="lg"
                  className="text-sm sm:text-base"
                  variant={
                    submitStatus === "error"
                      ? "destructive"
                      : submitStatus === "success"
                        ? "default"
                        : "default"
                  }
                >
                  <AnimatePresence mode="wait">
                    {submitStatus === "loading" && (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="inline-flex items-center gap-2"
                      >
                        <Spinner className="size-4 animate-spin" />
                        Submitting…
                      </motion.div>
                    )}

                    {submitStatus === "success" && (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="inline-flex items-center gap-2"
                      >
                        <CheckCircle className="size-4" />
                        Submitted!
                      </motion.div>
                    )}

                    {submitStatus === "error" && (
                      <motion.div
                        key="error"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="inline-flex items-center gap-2"
                      >
                        <XCircle className="size-4" />
                        Failed
                      </motion.div>
                    )}

                    {submitStatus === "idle" && (
                      <motion.div
                        key="idle"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="inline-flex items-center gap-2"
                      >
                        {currentStepIndex === steps.length - 1
                          ? "Submit Application"
                          : "Continue"}
                        {currentStepIndex !== steps.length - 1 && (
                          <ChevronRight className="w-5 h-5" />
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
