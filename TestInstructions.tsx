import { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { ScrollArea } from '../ui/scroll-area';
import { 
  ArrowLeft, 
  ArrowRight,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

interface TestInstructionsProps {
  test: any;
  onBack: () => void;
  onBegin: () => void;
}

export function TestInstructions({ test, onBack, onBegin }: TestInstructionsProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [language, setLanguage] = useState('English');
  const [confirmed, setConfirmed] = useState(false);

  const officialInstructions = [
    {
      section: 'General Instructions',
      items: [
        'The test contains MCQ (Multiple Choice Questions) and Numerical type questions.',
        'For each MCQ, there are four options out of which only one is correct.',
        'For Numerical type questions, the answer should be rounded off to the nearest integer.',
        'Each question carries marks as specified in the test configuration.',
        'There is negative marking for incorrect answers as specified.',
        'The clock will be set at the server. The countdown timer in the top right corner will display the remaining time available for you to complete the examination.',
        'When the timer reaches zero, the examination will end by itself. You will not be required to end or submit your examination.',
      ],
    },
    {
      section: 'Navigating to a Question',
      items: [
        'To answer a question, do the following: Click on the question number in the Question Palette to go to that question directly.',
        'Click on Save & Next to save your answer for the current question and then go to the next question.',
        'Click on Mark for Review & Next to save your answer for the current question, mark it for review, and then go to the next question.',
      ],
    },
    {
      section: 'Answering Questions',
      items: [
        'Procedure for answering a multiple choice type question: To select your answer, click on the button of one of the options.',
        'To deselect your chosen answer, click on the button of the chosen option again or click on the Clear Response button.',
        'To change your chosen answer, click on the button of another option.',
        'To save your answer, you MUST click on the Save & Next button.',
        'To mark the question for review, click on the Mark for Review & Next button.',
      ],
    },
    {
      section: 'Navigating through sections',
      items: [
        'Sections in this question paper are displayed on the top bar of the screen. Questions in a section can be viewed by clicking on the section name.',
        'The section you are currently viewing is highlighted.',
        'After clicking the Save & Next button on the last question for a section, you will automatically be taken to the first question of the next section.',
        'You can shuffle between sections and questions anytime during the examination as per your convenience.',
      ],
    },
  ];

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 lg:px-6 py-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-gray-900">{test.title}</h2>
              <p className="text-sm text-gray-600">Please read all instructions carefully</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              Page {currentPage} of 2
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto">
          {currentPage === 1 ? (
            <Card>
              <CardContent className="p-6">
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertCircle className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-gray-900">Official Test Instructions</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Please read the instructions carefully before starting the test.
                  </p>
                </div>

                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-6">
                    {officialInstructions.map((section, idx) => (
                      <div key={idx}>
                        <h4 className="text-gray-900 mb-3">{section.section}</h4>
                        <ol className="list-decimal list-inside space-y-2">
                          {section.items.map((item, itemIdx) => (
                            <li key={itemIdx} className="text-sm text-gray-700 leading-relaxed">
                              {item}
                            </li>
                          ))}
                        </ol>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6">
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h3 className="text-gray-900">Test Details & Important Information</h3>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                    <h4 className="text-sm text-indigo-900 mb-3">Test Configuration</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <span className="text-indigo-700 min-w-[200px]">1. Total Quality Score:</span>
                        <span className="text-indigo-900">{test.tqs}/100 aligned to {test.alignedToExam}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-indigo-700 min-w-[200px]">2. Total duration of the test:</span>
                        <span className="text-indigo-900">{test.duration}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-indigo-700 min-w-[200px]">3. Total number of questions:</span>
                        <span className="text-indigo-900">{test.questions} questions</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-indigo-700 min-w-[200px]">4. Marking scheme:</span>
                        <span className="text-indigo-900">
                          {test.correctMarks || '+4'} marks for correct answer, {test.incorrectMarks || '-1'} marks for incorrect answer
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-indigo-700 min-w-[200px]">5. Total sections:</span>
                        <span className="text-indigo-900">
                          1 section ({test.subject ? test.subject.charAt(0).toUpperCase() + test.subject.slice(1) : 'Mixed'})
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-indigo-700 min-w-[200px]">6. Section details:</span>
                        <span className="text-indigo-900">
                          Section 1 is {test.subject ? test.subject.charAt(0).toUpperCase() + test.subject.slice(1) : 'Mixed'} consisting of {test.questions} questions
                        </span>
                      </div>
                      {test.chapters && test.chapters.length > 0 && (
                        <div className="flex items-start gap-2">
                          <span className="text-indigo-700 min-w-[200px]">7. Chapters covered:</span>
                          <span className="text-indigo-900">{test.chapters.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="text-sm text-gray-900 mb-3">Language Settings</h4>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-700">Your default language:</span>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      >
                        <option value="English">English</option>
                        <option value="Hindi">Hindi</option>
                      </select>
                    </div>
                  </div>

                  <div className="border-t pt-6 mt-6">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="confirm"
                        checked={confirmed}
                        onCheckedChange={(checked) => setConfirmed(checked as boolean)}
                        className="mt-1"
                      />
                      <label htmlFor="confirm" className="text-sm text-gray-700 cursor-pointer">
                        I have read and understood all the instructions. I agree to follow all the rules and regulations mentioned above. Any violation of these may disqualify my candidature.
                      </label>
                    </div>
                  </div>

                  {!confirmed && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-yellow-800">
                        Please confirm that you have read and understood all instructions before proceeding.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="bg-white border-t px-4 lg:px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => {
              if (currentPage === 1) {
                onBack();
              } else {
                setCurrentPage(1);
              }
            }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {currentPage === 1 ? 'Back' : 'Previous'}
          </Button>

          {currentPage === 1 ? (
            <Button
              onClick={() => setCurrentPage(2)}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={onBegin}
              disabled={!confirmed}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              I'm Ready to Begin
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
