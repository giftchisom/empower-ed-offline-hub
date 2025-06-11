
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  BookOpen, 
  Users, 
  TrendingUp, 
  Library, 
  HelpCircle,
  Plus,
  Save,
  Check,
  X
} from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('empowered-students');
    return saved ? JSON.parse(saved) : [];
  });
  const [lessonPlans, setLessonPlans] = useState(() => {
    const saved = localStorage.getItem('empowered-lessons');
    return saved ? JSON.parse(saved) : [];
  });
  const [quizzes, setQuizzes] = useState(() => {
    const saved = localStorage.getItem('empowered-quizzes');
    return saved ? JSON.parse(saved) : [];
  });
  const [attendance, setAttendance] = useState(() => {
    const saved = localStorage.getItem('empowered-attendance');
    return saved ? JSON.parse(saved) : {};
  });

  // Save data to localStorage
  const saveToStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'lessons', label: 'Lesson Plans', icon: BookOpen },
    { id: 'attendance', label: 'Attendance', icon: Users },
    { id: 'performance', label: 'Performance', icon: TrendingUp },
    { id: 'resources', label: 'Resources', icon: Library },
    { id: 'quiz', label: 'Quiz Creator', icon: HelpCircle },
  ];

  const renderDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-600" />
            Lesson Plans
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-purple-700">{lessonPlans.length}</p>
          <p className="text-sm text-gray-600">Total plans created</p>
        </CardContent>
      </Card>

      <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            Students
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-purple-700">{students.length}</p>
          <p className="text-sm text-gray-600">Total students</p>
        </CardContent>
      </Card>

      <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-purple-600" />
            Quizzes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-purple-700">{quizzes.length}</p>
          <p className="text-sm text-gray-600">Quizzes created</p>
        </CardContent>
      </Card>
    </div>
  );

  const renderLessonPlans = () => {
    const [formData, setFormData] = useState({
      subject: '',
      objective: '',
      duration: '',
      outcomes: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const newPlan = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toLocaleDateString()
      };
      const updated = [...lessonPlans, newPlan];
      setLessonPlans(updated);
      saveToStorage('empowered-lessons', updated);
      setFormData({ subject: '', objective: '', duration: '', outcomes: '' });
    };

    return (
      <div className="space-y-6">
        <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle>Create New Lesson Plan</CardTitle>
            <CardDescription>Design your lesson with clear objectives and outcomes</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="objective">Learning Objective</Label>
                <Textarea
                  id="objective"
                  value={formData.objective}
                  onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="outcomes">Expected Outcomes</Label>
                <Textarea
                  id="outcomes"
                  value={formData.outcomes}
                  onChange={(e) => setFormData({ ...formData, outcomes: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                <Save className="w-4 h-4 mr-2" />
                Save Lesson Plan
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <h3 className="text-lg font-semibold text-white">Saved Lesson Plans</h3>
          {lessonPlans.map((plan: any) => (
            <Card key={plan.id} className="bg-white/90 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">{plan.subject}</CardTitle>
                <CardDescription>Created: {plan.createdAt} • Duration: {plan.duration} minutes</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-2"><strong>Objective:</strong> {plan.objective}</p>
                <p><strong>Outcomes:</strong> {plan.outcomes}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderAttendance = () => {
    const today = new Date().toLocaleDateString();
    const todayAttendance = attendance[today] || {};

    const markAttendance = (studentName: string, present: boolean) => {
      const updated = {
        ...attendance,
        [today]: {
          ...todayAttendance,
          [studentName]: present
        }
      };
      setAttendance(updated);
      saveToStorage('empowered-attendance', updated);
    };

    return (
      <div className="space-y-6">
        <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle>Today's Attendance - {today}</CardTitle>
            <CardDescription>Mark students as present or absent</CardDescription>
          </CardHeader>
          <CardContent>
            {students.length === 0 ? (
              <p className="text-gray-600">No students added yet. Add students in the Performance section first.</p>
            ) : (
              <div className="space-y-3">
                {students.map((student: any) => (
                  <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">{student.name}</span>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={todayAttendance[student.name] === true ? "default" : "outline"}
                        onClick={() => markAttendance(student.name, true)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Check className="w-4 h-4" />
                        Present
                      </Button>
                      <Button
                        size="sm"
                        variant={todayAttendance[student.name] === false ? "default" : "outline"}
                        onClick={() => markAttendance(student.name, false)}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        <X className="w-4 h-4" />
                        Absent
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderPerformance = () => {
    const [newStudent, setNewStudent] = useState({ name: '', score: '' });

    const addStudent = (e: React.FormEvent) => {
      e.preventDefault();
      const student = {
        id: Date.now(),
        name: newStudent.name,
        scores: [parseInt(newStudent.score)]
      };
      const updated = [...students, student];
      setStudents(updated);
      saveToStorage('empowered-students', updated);
      setNewStudent({ name: '', score: '' });
    };

    const addScore = (studentId: number, score: number) => {
      const updated = students.map((student: any) =>
        student.id === studentId
          ? { ...student, scores: [...student.scores, score] }
          : student
      );
      setStudents(updated);
      saveToStorage('empowered-students', updated);
    };

    const getAverage = (scores: number[]) => {
      return scores.reduce((a, b) => a + b, 0) / scores.length;
    };

    return (
      <div className="space-y-6">
        <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle>Add New Student</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={addStudent} className="flex gap-2">
              <Input
                placeholder="Student name"
                value={newStudent.name}
                onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                required
              />
              <Input
                type="number"
                placeholder="Initial score"
                value={newStudent.score}
                onChange={(e) => setNewStudent({ ...newStudent, score: e.target.value })}
                required
              />
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4" />
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {students.map((student: any) => {
            const average = getAverage(student.scores);
            const isWeak = average < 70;
            
            return (
              <Card key={student.id} className={`bg-white/90 backdrop-blur-sm shadow-lg ${isWeak ? 'border-red-300' : ''}`}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {student.name}
                    <span className={`text-lg ${isWeak ? 'text-red-600' : 'text-green-600'}`}>
                      Avg: {average.toFixed(1)}%
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {student.scores.map((score: number, index: number) => (
                      <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-sm">
                        {score}%
                      </span>
                    ))}
                  </div>
                  {isWeak && (
                    <p className="text-red-600 text-sm font-medium">⚠️ Needs attention - Below 70% average</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  const renderResources = () => (
    <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
      <CardHeader>
        <CardTitle>Resource Library</CardTitle>
        <CardDescription>Access educational materials and tools</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="p-4 bg-purple-50 rounded-lg">
            <h4 className="font-semibold text-purple-800">Teaching Templates</h4>
            <p className="text-sm text-gray-600">Ready-to-use lesson plan templates for various subjects</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <h4 className="font-semibold text-purple-800">Assessment Tools</h4>
            <p className="text-sm text-gray-600">Rubrics and evaluation frameworks</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <h4 className="font-semibold text-purple-800">Classroom Management</h4>
            <p className="text-sm text-gray-600">Strategies for effective classroom organization</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderQuizCreator = () => {
    const [quizForm, setQuizForm] = useState({
      title: '',
      questions: [{ question: '', options: ['', '', '', ''], correct: 0 }]
    });

    const addQuestion = () => {
      setQuizForm({
        ...quizForm,
        questions: [...quizForm.questions, { question: '', options: ['', '', '', ''], correct: 0 }]
      });
    };

    const updateQuestion = (index: number, field: string, value: any) => {
      const updated = quizForm.questions.map((q, i) =>
        i === index ? { ...q, [field]: value } : q
      );
      setQuizForm({ ...quizForm, questions: updated });
    };

    const saveQuiz = () => {
      const newQuiz = {
        id: Date.now(),
        ...quizForm,
        createdAt: new Date().toLocaleDateString()
      };
      const updated = [...quizzes, newQuiz];
      setQuizzes(updated);
      saveToStorage('empowered-quizzes', updated);
      setQuizForm({ title: '', questions: [{ question: '', options: ['', '', '', ''], correct: 0 }] });
    };

    return (
      <div className="space-y-6">
        <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle>Create Quiz</CardTitle>
            <CardDescription>Build multiple choice quizzes for your students</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="quiz-title">Quiz Title</Label>
              <Input
                id="quiz-title"
                value={quizForm.title}
                onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
                placeholder="Enter quiz title"
              />
            </div>

            {quizForm.questions.map((q, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div>
                  <Label>Question {index + 1}</Label>
                  <Textarea
                    value={q.question}
                    onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                    placeholder="Enter your question"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {q.options.map((option, optIndex) => (
                    <div key={optIndex} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`correct-${index}`}
                        checked={q.correct === optIndex}
                        onChange={() => updateQuestion(index, 'correct', optIndex)}
                        className="text-purple-600"
                      />
                      <Input
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...q.options];
                          newOptions[optIndex] = e.target.value;
                          updateQuestion(index, 'options', newOptions);
                        }}
                        placeholder={`Option ${optIndex + 1}`}
                        className="flex-1"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex gap-2">
              <Button onClick={addQuestion} variant="outline" className="flex-1">
                <Plus className="w-4 h-4 mr-2" />
                Add Question
              </Button>
              <Button onClick={saveQuiz} className="flex-1 bg-purple-600 hover:bg-purple-700">
                <Save className="w-4 h-4 mr-2" />
                Save Quiz
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Saved Quizzes</h3>
          {quizzes.map((quiz: any) => (
            <Card key={quiz.id} className="bg-white/90 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle>{quiz.title}</CardTitle>
                <CardDescription>
                  {quiz.questions.length} questions • Created: {quiz.createdAt}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboard();
      case 'lessons': return renderLessonPlans();
      case 'attendance': return renderAttendance();
      case 'performance': return renderPerformance();
      case 'resources': return renderResources();
      case 'quiz': return renderQuizCreator();
      default: return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-purple-600 to-pink-500">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-white/10 backdrop-blur-md shadow-lg">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-white mb-8">EmpowerEd</h1>
            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      activeTab === item.id
                        ? 'bg-white text-purple-700 shadow-lg'
                        : 'text-white hover:bg-white/20'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                {navItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
              </h2>
              <p className="text-purple-100">
                Empowering teachers with offline-friendly tools for effective classroom management
              </p>
            </div>
            
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
