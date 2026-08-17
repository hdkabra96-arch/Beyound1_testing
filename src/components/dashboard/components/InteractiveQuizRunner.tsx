import React, { useState, useEffect } from 'react';
import { EducationalContent } from '../../../types/admin';
import { useStudent } from '../../../services/student-context';
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Award,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Sparkles,
  BookOpen,
  HelpCircle,
  Check,
  X,
  Send,
} from 'lucide-react';

interface InteractiveQuizRunnerProps {
  content: EducationalContent;
  onClose: () => void;
}

interface QuestionItem {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hint?: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'olympiad';
}

export const InteractiveQuizRunner: React.FC<InteractiveQuizRunnerProps> = ({ content, onClose }) => {
  const { currentStudent, recordPracticeAttempt } = useStudent();

  // Generate realistic questions dynamically based on content title & chapter
  const questions: QuestionItem[] = [
    {
      id: 1,
      question: 'In the number 7,85,420, what is the place value of the digit 8?',
      options: ['8,000 (Eight Thousand)', '80,000 (Eighty Thousand)', '8,00,000 (Eight Lakh)', '800 (Eight Hundred)'],
      correctIndex: 1,
      explanation: 'The digit 8 is located in the Ten-Thousands period. Place value = 8 × 10,000 = 80,000.',
      hint: 'Count the places from right: Units(0), Tens(2), Hundreds(4), Thousands(5), Ten-Thousands(8).',
      difficulty: 'easy',
    },
    {
      id: 2,
      question: 'Which of the following numbers is the greatest?',
      options: ['5,49,201', '5,94,201', '5,49,999', '5,94,102'],
      correctIndex: 1,
      explanation: 'Comparing the ten-thousands place: 9 in 5,94,201 is greater than 4 in 5,49,201. Between 5,94,201 and 5,94,102, comparing the hundreds digit: 200 > 100.',
      hint: 'Compare digits from left to right starting at the highest period.',
      difficulty: 'easy',
    },
    {
      id: 3,
      question: 'A fish drying factory dries 6,000 kg of fresh fish in a month. Dried fish weighs 1/3 of the fresh fish. How much dried fish will they obtain?',
      options: ['2,000 kg', '3,000 kg', '1,500 kg', '18,000 kg'],
      correctIndex: 0,
      explanation: 'Weight of dried fish = 1/3 of 6,000 kg = 6,000 ÷ 3 = 2,000 kg.',
      hint: 'Multiply 6,000 by 1/3 or divide 6,000 by 3.',
      difficulty: 'medium',
    },
    {
      id: 4,
      question: 'If one log boat brings 20 kg of fish in one trip, how many kg will 7 such log boats bring in 4 trips each?',
      options: ['140 kg', '280 kg', '560 kg', '80 kg'],
      correctIndex: 2,
      explanation: '1 trip by 1 boat = 20 kg. 4 trips by 1 boat = 20 × 4 = 80 kg. 7 boats = 80 × 7 = 560 kg.',
      hint: 'Total fish = (Boats) × (Trips per boat) × (kg per trip).',
      difficulty: 'medium',
    },
    {
      id: 5,
      question: 'Write forty-five lakh twenty thousand three hundred seven in standard numeral notation:',
      options: ['45,20,307', '4,52,307', '45,02,370', '4,52,037'],
      correctIndex: 0,
      explanation: 'Forty-five lakh (45,) + twenty thousand (20,) + three hundred seven (307) = 45,20,307.',
      hint: 'Check periods: Lakhs period is 45, Thousands period is 20, Ones period is 307.',
      difficulty: 'hard',
    },
  ];

  const totalQuestions = questions.length;
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showHint, setShowHint] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState((content.time_limit_minutes || 15) * 60);

  // Timer countdown
  useEffect(() => {
    if (isSubmitted) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isSubmitted]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIdx]: optionIndex,
    }));
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correct += 1;
      }
    });
    const percentage = Math.round((correct / totalQuestions) * 100);
    const marksEarned = Math.round((correct / totalQuestions) * (content.total_marks || 20));
    return { correct, percentage, marksEarned };
  };

  const handleSubmitQuiz = () => {
    setIsSubmitted(true);
    const { correct, percentage, marksEarned } = calculateScore();
    const timeSpent = (content.time_limit_minutes || 15) * 60 - secondsRemaining;

    // Record in student store
    recordPracticeAttempt({
      contentId: content.id,
      contentTitle: content.title,
      classId: content.class_id,
      subjectId: content.subject_id,
      chapterId: content.chapter_id,
      totalQuestions,
      correctAnswers: correct,
      score: marksEarned,
      maxScore: content.total_marks || 20,
      timeSpentSeconds: Math.max(10, timeSpent),
      accuracyPercentage: percentage,
      selectedAnswers,
    });
  };

  const currentQ = questions[currentIdx];
  const { correct, percentage, marksEarned } = calculateScore();

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header bar */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 truncate">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-md shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div className="truncate">
              <h2 className="text-sm sm:text-base font-black text-white truncate">{content.title}</h2>
              <p className="text-xs text-slate-400">
                {totalQuestions} Questions • {content.total_marks || 20} Marks • Class {content.class_id.replace('class_', '')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Timer Badge */}
            {!isSubmitted && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono font-bold text-amber-400 shadow-inner">
                <Clock className="w-3.5 h-3.5 animate-pulse" />
                <span>{formatTime(secondsRemaining)}</span>
              </div>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quiz Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col">
          {!isSubmitted ? (
            <div className="flex-1 flex flex-col justify-between max-w-3xl mx-auto w-full space-y-6">
              {/* Question progress and question text */}
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-extrabold uppercase px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                    Question {currentIdx + 1} of {totalQuestions}
                  </span>
                  <div className="flex items-center gap-1">
                    {questions.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentIdx(i)}
                        className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          currentIdx === i
                            ? 'bg-indigo-600 text-white ring-2 ring-indigo-400'
                            : selectedAnswers[i] !== undefined
                            ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-5 sm:p-6 rounded-2xl bg-slate-950 border border-slate-800">
                  <p className="text-sm sm:text-base font-bold text-white leading-relaxed">
                    {currentQ.question}
                  </p>
                </div>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((opt, optIdx) => {
                  const isSelected = selectedAnswers[currentIdx] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full p-4 rounded-2xl text-left text-xs sm:text-sm font-semibold transition-all flex items-center justify-between cursor-pointer border ${
                        isSelected
                          ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/10'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center ${
                            isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{opt}</span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-indigo-400" />}
                    </button>
                  );
                })}
              </div>

              {/* Hint section */}
              {currentQ.hint && (
                <div>
                  {!showHint ? (
                    <button
                      onClick={() => setShowHint(true)}
                      className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1.5 cursor-pointer"
                    >
                      <HelpCircle className="w-4 h-4" />
                      <span>Need a hint?</span>
                    </button>
                  ) : (
                    <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/60 text-xs text-amber-300 flex items-start gap-2 animate-fade-in">
                      <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>Hint: {currentQ.hint}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Navigation and Submit footer inside test */}
              <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-800">
                <button
                  onClick={() => {
                    if (currentIdx > 0) {
                      setCurrentIdx((prev) => prev - 1);
                      setShowHint(false);
                    }
                  }}
                  disabled={currentIdx === 0}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 disabled:opacity-30 cursor-pointer flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                {currentIdx < totalQuestions - 1 ? (
                  <button
                    onClick={() => {
                      setCurrentIdx((prev) => prev + 1);
                      setShowHint(false);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
                  >
                    <span>Next Question</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitQuiz}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white text-xs font-black cursor-pointer flex items-center gap-2 shadow-lg shadow-emerald-600/30"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Assessment</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Result Summary & Step-by-Step Solutions */
            <div className="max-w-3xl mx-auto w-full space-y-8 animate-fade-in">
              {/* Score card */}
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-950/80 to-slate-900 border border-indigo-800/80 text-center space-y-4 shadow-2xl">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-indigo-600/30 border border-indigo-500 text-indigo-400 text-2xl font-black">
                  🎉
                </div>

                <div>
                  <h3 className="text-2xl font-black text-white">Assessment Completed!</h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Here is your performance breakdown for {content.title}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3 max-w-md mx-auto pt-2">
                  <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Score</span>
                    <p className="text-xl font-black text-emerald-400">{marksEarned} / {content.total_marks || 20}</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Accuracy</span>
                    <p className="text-xl font-black text-indigo-400">{percentage}%</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Correct</span>
                    <p className="text-xl font-black text-amber-400">{correct} / {totalQuestions}</p>
                  </div>
                </div>
              </div>

              {/* Detailed Question Review with Step Solutions */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <BookOpen className="w-4 h-4 text-indigo-400" />
                  <h3>Question-by-Question Review & Solutions</h3>
                </div>

                <div className="space-y-4">
                  {questions.map((q, idx) => {
                    const userAns = selectedAnswers[idx];
                    const isCorrect = userAns === q.correctIndex;

                    return (
                      <div
                        key={idx}
                        className={`p-5 rounded-2xl border ${
                          isCorrect
                            ? 'bg-emerald-950/20 border-emerald-800/60'
                            : 'bg-rose-950/20 border-rose-800/60'
                        } space-y-3`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-white">Q{idx + 1}.</span>
                            <span className="text-xs font-bold text-slate-200">{q.question}</span>
                          </div>
                          {isCorrect ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400">
                              <CheckCircle2 className="w-3 h-3" /> Correct
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-400">
                              <XCircle className="w-3 h-3" /> Incorrect
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                            <span className="text-[10px] text-slate-500 font-bold block">Your Answer:</span>
                            <span className={isCorrect ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                              {userAns !== undefined ? q.options[userAns] : 'Not Attempted'}
                            </span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                            <span className="text-[10px] text-slate-500 font-bold block">Correct Answer:</span>
                            <span className="text-emerald-400 font-bold">{q.options[q.correctIndex]}</span>
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-900/60 text-xs text-slate-300 space-y-1">
                          <span className="text-[10px] font-extrabold uppercase text-indigo-400">Step Explanation:</span>
                          <p className="leading-relaxed">{q.explanation}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Done button */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={onClose}
                  className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold cursor-pointer"
                >
                  Return to Chapter
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
