import { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check,
  BookOpen,
} from 'lucide-react';
import { UserData } from '../../App';

interface CustomTestCreationProps {
  onBack: () => void;
  onTestCreated: (test: any) => void;
  userData: UserData;
}

interface ChapterData {
  [key: string]: string[];
}

const chapters: ChapterData = {
  physics: [
    'Mechanics - Laws of Motion',
    'Mechanics - Work Energy Power',
    'Rotational Motion',
    'Gravitation',
    'Thermodynamics',
    'Kinetic Theory of Gases',
    'Oscillations and Waves',
    'Electrostatics',
    'Current Electricity',
    'Magnetic Effects of Current',
    'Electromagnetic Induction',
    'Alternating Current',
    'Optics - Ray Optics',
    'Optics - Wave Optics',
    'Modern Physics - Dual Nature',
    'Modern Physics - Atoms and Nuclei',
  ],
  mathematics: [
    'Sets and Relations',
    'Complex Numbers',
    'Quadratic Equations',
    'Sequences and Series',
    'Permutations and Combinations',
    'Binomial Theorem',
    'Limits and Continuity',
    'Differentiation',
    'Applications of Derivatives',
    'Integration',
    'Definite Integrals',
    'Differential Equations',
    'Straight Lines',
    'Circles',
    'Conic Sections',
    'Vector Algebra',
    '3D Geometry',
    'Probability',
    'Statistics',
  ],
  chemistry: [
    'Atomic Structure',
    'Chemical Bonding',
    'States of Matter - Gaseous and Liquid',
    'Solid State',
    'Solutions',
    'Thermodynamics',
    'Chemical Equilibrium',
    'Ionic Equilibrium',
    'Redox Reactions',
    'Electrochemistry',
    'Chemical Kinetics',
    'Surface Chemistry',
    'General Organic Chemistry',
    'Hydrocarbons',
    'Alkyl Halides',
    'Alcohols and Ethers',
    'Aldehydes and Ketones',
    'Carboxylic Acids',
    'Amines',
    'Polymers',
    'Biomolecules',
    'Coordination Compounds',
    'p-Block Elements',
    'd and f Block Elements',
  ],
};

export function CustomTestCreation({ onBack, onTestCreated, userData }: CustomTestCreationProps) {
  const [step, setStep] = useState(1);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);
  const [testName, setTestName] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [duration, setDuration] = useState('60');
  const [correctMarks, setCorrectMarks] = useState('+4');
  const [incorrectMarks, setIncorrectMarks] = useState('-1');

  const subjects = [
    { id: 'physics', name: 'Physics', icon: '⚛️' },
    { id: 'mathematics', name: 'Mathematics', icon: '📐' },
    { id: 'chemistry', name: 'Chemistry', icon: '🧪' },
  ];

  const difficulties = ['Easy', 'Medium', 'Hard'];
  const durations = ['15', '30', '60', '90', '120', '180'];
  const correctMarksOptions = ['+1', '+2', '+3', '+4', '+5'];
  const incorrectMarksOptions = ['0', '-1', '-2'];

  const handleChapterToggle = (chapter: string) => {
    setSelectedChapters(prev => 
      prev.includes(chapter) 
        ? prev.filter(c => c !== chapter)
        : [...prev, chapter]
    );
  };

  const handleCreate = () => {
    // Calculate number of questions based on duration and difficulty
    const durationNum = parseInt(duration);
    let numQuestions = Math.floor(durationNum / 2); // Roughly 2 minutes per question
    
    if (difficulty === 'Hard') {
      numQuestions = Math.floor(numQuestions * 0.8); // Fewer questions for hard difficulty
    } else if (difficulty === 'Easy') {
      numQuestions = Math.floor(numQuestions * 1.2); // More questions for easy difficulty
    }

    const correctMarksNum = parseInt(correctMarks.replace('+', ''));
    const totalMarks = numQuestions * correctMarksNum;

    const newTest = {
      id: `custom-${Date.now()}`,
      title: testName,
      type: 'Custom Test',
      duration: `${duration} mins`,
      questions: numQuestions,
      marks: totalMarks,
      coins: Math.floor(totalMarks / 2),
      subject: selectedSubject,
      difficulty: difficulty,
      syllabus: selectedChapters.join(', '),
      description: `AI-generated custom test on ${selectedChapters.length} chapters`,
      tqs: 85,
      alignedToExam: userData.selectedDomain === 'jee' ? 'JEE Main' : 'NEET',
      chapters: selectedChapters,
      correctMarks: correctMarks,
      incorrectMarks: incorrectMarks,
      isCustom: true,
      attempted: false,
    };

    onTestCreated(newTest);
  };

  const canProceedStep1 = selectedSubject !== '';
  const canProceedStep2 = selectedChapters.length > 0;
  const canCreate = testName.trim() !== '' && difficulty !== '' && duration !== '';

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 lg:px-6 py-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tests
          </Button>
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm ${
                  s === step
                    ? 'bg-indigo-600 text-white'
                    : s < step
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {s < step ? <Check className="w-4 h-4" /> : s}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          {/* Step 1: Choose Subject */}
          {step === 1 && (
            <div>
              <div className="text-center mb-8">
                <h2 className="text-gray-900 mb-2">Choose Subject</h2>
                <p className="text-gray-600">Select the subject for your custom test</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {subjects.map((subject) => (
                  <Card
                    key={subject.id}
                    className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                      selectedSubject === subject.id
                        ? 'ring-2 ring-indigo-600 shadow-lg'
                        : ''
                    }`}
                    onClick={() => setSelectedSubject(subject.id)}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl mb-3">{subject.icon}</div>
                      <h3 className="text-gray-900">{subject.name}</h3>
                      <p className="text-sm text-gray-600 mt-2">
                        {chapters[subject.id].length} chapters available
                      </p>
                      {selectedSubject === subject.id && (
                        <div className="mt-4">
                          <Badge className="bg-indigo-600">Selected</Badge>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Choose Chapters */}
          {step === 2 && selectedSubject && (
            <div>
              <div className="text-center mb-8">
                <h2 className="text-gray-900 mb-2">Choose Chapters</h2>
                <p className="text-gray-600">
                  Select the chapters to include in your test ({selectedChapters.length} selected)
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {chapters[selectedSubject].map((chapter) => (
                  <Card
                    key={chapter}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedChapters.includes(chapter)
                        ? 'ring-2 ring-indigo-600 bg-indigo-50'
                        : ''
                    }`}
                    onClick={() => handleChapterToggle(chapter)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          selectedChapters.includes(chapter)
                            ? 'bg-indigo-600 border-indigo-600'
                            : 'border-gray-300'
                        }`}>
                          {selectedChapters.includes(chapter) && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">{chapter}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Configure Test */}
          {step === 3 && (
            <div>
              <div className="text-center mb-8">
                <h2 className="text-gray-900 mb-2">Configure Your Test</h2>
                <p className="text-gray-600">Set up test parameters</p>
              </div>

              <Card>
                <CardContent className="p-6 space-y-6">
                  {/* Test Name */}
                  <div>
                    <Label htmlFor="testName" className="text-sm">Test Name</Label>
                    <Input
                      id="testName"
                      placeholder="Enter test name"
                      value={testName}
                      onChange={(e) => setTestName(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  {/* Difficulty Level */}
                  <div>
                    <Label className="text-sm">Difficulty Level</Label>
                    <div className="grid grid-cols-3 gap-3 mt-2">
                      {difficulties.map((diff) => (
                        <button
                          key={diff}
                          onClick={() => setDifficulty(diff)}
                          className={`p-3 rounded-lg border-2 text-sm transition-all ${
                            difficulty === diff
                              ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {diff}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Duration */}
                  <div>
                    <Label className="text-sm">Duration</Label>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mt-2">
                      {durations.map((dur) => (
                        <button
                          key={dur}
                          onClick={() => setDuration(dur)}
                          className={`p-3 rounded-lg border-2 text-sm transition-all ${
                            duration === dur
                              ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {dur} min
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Correct Marks */}
                  <div>
                    <Label className="text-sm">Marks for Correct Answer</Label>
                    <div className="grid grid-cols-5 gap-3 mt-2">
                      {correctMarksOptions.map((mark) => (
                        <button
                          key={mark}
                          onClick={() => setCorrectMarks(mark)}
                          className={`p-3 rounded-lg border-2 text-sm transition-all ${
                            correctMarks === mark
                              ? 'border-green-600 bg-green-50 text-green-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {mark}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Incorrect Marks */}
                  <div>
                    <Label className="text-sm">Marks for Incorrect Answer</Label>
                    <div className="grid grid-cols-3 gap-3 mt-2">
                      {incorrectMarksOptions.map((mark) => (
                        <button
                          key={mark}
                          onClick={() => setIncorrectMarks(mark)}
                          className={`p-3 rounded-lg border-2 text-sm transition-all ${
                            incorrectMarks === mark
                              ? 'border-red-600 bg-red-50 text-red-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {mark}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mt-6">
                    <h4 className="text-sm text-indigo-900 mb-3">Test Summary</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-indigo-700">Subject:</span>
                        <span className="text-indigo-900 ml-2 capitalize">{selectedSubject}</span>
                      </div>
                      <div>
                        <span className="text-indigo-700">Chapters:</span>
                        <span className="text-indigo-900 ml-2">{selectedChapters.length}</span>
                      </div>
                      <div>
                        <span className="text-indigo-700">Difficulty:</span>
                        <span className="text-indigo-900 ml-2">{difficulty}</span>
                      </div>
                      <div>
                        <span className="text-indigo-700">Duration:</span>
                        <span className="text-indigo-900 ml-2">{duration} minutes</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="bg-white border-t px-4 lg:px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => {
              if (step > 1) setStep(step - 1);
              else onBack();
            }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {step < 3 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={
                (step === 1 && !canProceedStep1) ||
                (step === 2 && !canProceedStep2)
              }
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleCreate}
              disabled={!canCreate}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Create Test
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
