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
    <div className="h-screen flex flex-col bg-gradient-to-br from-orange-50 via-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-purple-200 px-4 lg:px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <Button variant="ghost" onClick={onBack} className="text-purple-700 hover:bg-purple-100 hover:text-purple-900">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tests
          </Button>
          <div className="flex items-center gap-3">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`flex items-center justify-center w-10 h-10 rounded-full text-sm transition-all duration-300 ${
                  s === step
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg scale-110'
                    : s < step
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md'
                    : 'bg-white border-2 border-purple-300 text-purple-600'
                }`}
              >
                {s < step ? <Check className="w-5 h-5" /> : s}
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
                <h2 className="bg-gradient-to-r from-orange-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">Choose Subject</h2>
                <p className="text-purple-700">Select the subject for your custom test</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {subjects.map((subject, index) => (
                  <Card
                    key={subject.id}
                    className={`cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 bg-white/90 backdrop-blur border-2 ${
                      selectedSubject === subject.id
                        ? index === 0 
                          ? 'ring-4 ring-orange-400 shadow-2xl shadow-orange-200 border-orange-400 scale-105'
                          : index === 1
                          ? 'ring-4 ring-purple-400 shadow-2xl shadow-purple-200 border-purple-400 scale-105'
                          : 'ring-4 ring-blue-400 shadow-2xl shadow-blue-200 border-blue-400 scale-105'
                        : 'border-purple-200 hover:border-purple-400'
                    }`}
                    onClick={() => setSelectedSubject(subject.id)}
                  >
                    <CardContent className="p-8 text-center">
                      <div className="text-6xl mb-4 transform hover:scale-110 transition-transform duration-300">{subject.icon}</div>
                      <h3 className={`text-gray-900 mb-2 ${selectedSubject === subject.id ? '' : ''}`}>{subject.name}</h3>
                      <p className="text-sm text-purple-600 mt-2">
                        {chapters[subject.id].length} chapters available
                      </p>
                      {selectedSubject === subject.id && (
                        <div className="mt-4">
                          <Badge className={`${
                            index === 0 
                              ? 'bg-gradient-to-r from-orange-500 to-red-500'
                              : index === 1
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                              : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                          } text-white shadow-lg`}>Selected ✓</Badge>
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
                <h2 className="bg-gradient-to-r from-orange-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">Choose Chapters</h2>
                <p className="text-purple-700">
                  Select the chapters to include in your test 
                  <span className="ml-2 inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm shadow-lg">
                    {selectedChapters.length} selected
                  </span>
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {chapters[selectedSubject].map((chapter) => (
                  <Card
                    key={chapter}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-102 bg-white/90 backdrop-blur border-2 ${
                      selectedChapters.includes(chapter)
                        ? 'ring-2 ring-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-400 shadow-lg shadow-purple-200'
                        : 'border-purple-200 hover:border-purple-300'
                    }`}
                    onClick={() => handleChapterToggle(chapter)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-200 ${
                          selectedChapters.includes(chapter)
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-purple-500 shadow-md'
                            : 'border-purple-300 bg-white'
                        }`}>
                          {selectedChapters.includes(chapter) && (
                            <Check className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${selectedChapters.includes(chapter) ? 'text-purple-900' : 'text-gray-700'}`}>{chapter}</p>
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
                <h2 className="bg-gradient-to-r from-orange-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">Configure Your Test</h2>
                <p className="text-purple-700">Set up test parameters and preferences</p>
              </div>

              <Card className="bg-white/90 backdrop-blur border-2 border-purple-200 shadow-2xl">
                <CardContent className="p-8 space-y-8">
                  {/* Test Name */}
                  <div>
                    <Label htmlFor="testName" className="text-sm text-purple-900">Test Name</Label>
                    <Input
                      id="testName"
                      placeholder="e.g., My Physics Practice Test"
                      value={testName}
                      onChange={(e) => setTestName(e.target.value)}
                      className="mt-2 bg-white border-2 border-purple-300 focus:border-purple-500 text-gray-900 placeholder:text-purple-400 h-12 shadow-sm"
                    />
                  </div>

                  {/* Difficulty Level */}
                  <div>
                    <Label className="text-sm text-purple-900">Difficulty Level</Label>
                    <div className="grid grid-cols-3 gap-4 mt-3">
                      {difficulties.map((diff, index) => (
                        <button
                          key={diff}
                          onClick={() => setDifficulty(diff)}
                          className={`p-4 rounded-xl border-2 text-sm transition-all duration-300 ${
                            difficulty === diff
                              ? index === 0
                                ? 'border-green-500 bg-gradient-to-br from-green-100 to-emerald-100 text-green-800 shadow-lg shadow-green-200 scale-105'
                                : index === 1
                                ? 'border-orange-500 bg-gradient-to-br from-orange-100 to-yellow-100 text-orange-800 shadow-lg shadow-orange-200 scale-105'
                                : 'border-red-500 bg-gradient-to-br from-red-100 to-pink-100 text-red-800 shadow-lg shadow-red-200 scale-105'
                              : 'border-purple-300 bg-white text-gray-700 hover:border-purple-400 hover:shadow-md'
                          }`}
                        >
                          {diff}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Duration */}
                  <div>
                    <Label className="text-sm text-purple-900">Duration (minutes)</Label>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mt-3">
                      {durations.map((dur) => (
                        <button
                          key={dur}
                          onClick={() => setDuration(dur)}
                          className={`p-3 rounded-xl border-2 text-sm transition-all duration-300 ${
                            duration === dur
                              ? 'border-blue-500 bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-800 shadow-lg shadow-blue-200 scale-105'
                              : 'border-purple-300 bg-white text-gray-700 hover:border-purple-400 hover:shadow-md'
                          }`}
                        >
                          {dur}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Correct Marks */}
                  <div>
                    <Label className="text-sm text-purple-900">Marks for Correct Answer</Label>
                    <div className="grid grid-cols-5 gap-3 mt-3">
                      {correctMarksOptions.map((mark) => (
                        <button
                          key={mark}
                          onClick={() => setCorrectMarks(mark)}
                          className={`p-3 rounded-xl border-2 text-sm transition-all duration-300 ${
                            correctMarks === mark
                              ? 'border-green-500 bg-gradient-to-br from-green-100 to-emerald-100 text-green-800 shadow-lg shadow-green-200 scale-110'
                              : 'border-purple-300 bg-white text-gray-700 hover:border-purple-400 hover:shadow-md'
                          }`}
                        >
                          {mark}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Incorrect Marks */}
                  <div>
                    <Label className="text-sm text-purple-900">Marks for Incorrect Answer</Label>
                    <div className="grid grid-cols-3 gap-4 mt-3">
                      {incorrectMarksOptions.map((mark) => (
                        <button
                          key={mark}
                          onClick={() => setIncorrectMarks(mark)}
                          className={`p-3 rounded-xl border-2 text-sm transition-all duration-300 ${
                            incorrectMarks === mark
                              ? 'border-red-500 bg-gradient-to-br from-red-100 to-pink-100 text-red-800 shadow-lg shadow-red-200 scale-110'
                              : 'border-purple-300 bg-white text-gray-700 hover:border-purple-400 hover:shadow-md'
                          }`}
                        >
                          {mark}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 border-2 border-purple-300 rounded-2xl p-6 mt-8 shadow-lg">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse"></div>
                      <h4 className="text-sm text-purple-900">Test Summary</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-white/60 rounded-lg p-3 backdrop-blur">
                        <span className="text-purple-700">Subject:</span>
                        <span className="text-purple-900 ml-2 capitalize block mt-1">{selectedSubject}</span>
                      </div>
                      <div className="bg-white/60 rounded-lg p-3 backdrop-blur">
                        <span className="text-purple-700">Chapters:</span>
                        <span className="text-purple-900 ml-2 block mt-1">{selectedChapters.length}</span>
                      </div>
                      <div className="bg-white/60 rounded-lg p-3 backdrop-blur">
                        <span className="text-purple-700">Difficulty:</span>
                        <span className="text-purple-900 ml-2 block mt-1">{difficulty}</span>
                      </div>
                      <div className="bg-white/60 rounded-lg p-3 backdrop-blur">
                        <span className="text-purple-700">Duration:</span>
                        <span className="text-purple-900 ml-2 block mt-1">{duration} minutes</span>
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
      <div className="bg-white/80 backdrop-blur-md border-t border-purple-200 px-4 lg:px-6 py-5 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => {
              if (step > 1) setStep(step - 1);
              else onBack();
            }}
            className="border-2 border-purple-400 text-purple-700 hover:bg-purple-100 hover:border-purple-500 h-12 px-6 shadow-sm"
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
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-12 px-8 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleCreate}
              disabled={!canCreate}
              className="bg-gradient-to-r from-orange-500 via-purple-500 to-blue-500 hover:from-orange-600 hover:via-purple-600 hover:to-blue-600 text-white h-12 px-8 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed animate-pulse"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Create Test ✨
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
