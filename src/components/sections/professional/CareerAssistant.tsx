import { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { 
  MessageSquare,
  Send,
  Sparkles,
  TrendingUp,
  Target,
  AlertCircle,
  BookOpen,
  Lightbulb,
  Trash2
} from 'lucide-react';
import { UserData } from '../../../App';
import { toast } from 'sonner';

interface CareerAssistantProps {
  userData: UserData;
}

interface Message {
  type: 'user' | 'assistant';
  text: string;
  time: string;
}

export function CareerAssistant({ userData }: CareerAssistantProps) {
  const [message, setMessage] = useState('');
  const [conversationHistory, setConversationHistory] = useState<Message[]>([
    {
      type: 'user',
      text: 'How close am I to being ready for Tech Lead role?',
      time: '10:30 AM'
    },
    {
      type: 'assistant',
      text: `Based on your current progress, you're at 68% readiness for ${userData.targetRole}. Here's what you need to focus on:\n\n1. **System Design** (Gap: 13%) - Critical for tech lead role\n2. **Leadership Skills** (Gap: 30%) - Most important gap\n3. **Team Management** - Need practical experience\n\nEstimated time to readiness: 4-6 months with consistent effort.`,
      time: '10:30 AM'
    },
    {
      type: 'user',
      text: 'What should I focus on this week?',
      time: '10:32 AM'
    },
    {
      type: 'assistant',
      text: `This week, I recommend:\n\n1. Complete "Microservices Migration Plan" task (2-3 hours)\n2. Watch leadership training module 3 (1 hour)\n3. Practice system design problems (2 hours)\n4. Read 2 case studies on tech leadership\n\nThis will give you maximum impact toward your goal.`,
      time: '10:32 AM'
    }
  ]);
  
  const suggestedQuestions = [
    'What skills should I focus on this month?',
    'Am I ready for a promotion to Tech Lead?',
    'How do I improve my leadership skills?',
    'What certifications should I pursue?',
    'How can I prepare for system design interviews?'
  ];

  const insights = [
    {
      title: 'You\'re on track',
      description: 'Your learning pace is 15% faster than average professionals targeting similar roles',
      icon: <TrendingUp className="w-5 h-5 text-green-400" />,
      color: 'from-green-500/10 to-emerald-500/10 border-green-500/30'
    },
    {
      title: 'Focus Area',
      description: 'Leadership skills need the most attention - consider taking on team mentoring',
      icon: <Target className="w-5 h-5 text-orange-400" />,
      color: 'from-orange-500/10 to-red-500/10 border-orange-500/30'
    },
    {
      title: 'Next Milestone',
      description: 'Complete AWS certification to boost your cloud architecture credibility',
      icon: <AlertCircle className="w-5 h-5 text-blue-400" />,
      color: 'from-blue-500/10 to-cyan-500/10 border-blue-500/30'
    }
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      const currentTime = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
      
      // Add user message
      const userMessage: Message = {
        type: 'user',
        text: message,
        time: currentTime
      };
      setConversationHistory([...conversationHistory, userMessage]);
      
      // Simulate AI response
      setTimeout(() => {
        const aiResponse: Message = {
          type: 'assistant',
          text: getAIResponse(message),
          time: currentTime
        };
        setConversationHistory(prev => [...prev, aiResponse]);
      }, 1000);
      
      setMessage('');
      toast.success('Message sent!');
    }
  };

  const getAIResponse = (question: string) => {
    const lowerQ = question.toLowerCase();
    
    if (lowerQ.includes('skill') || lowerQ.includes('focus')) {
      return `Based on your skill gap analysis, focus on:\n\n1. System Design (13% gap)\n2. Cloud Architecture (AWS/Azure)\n3. Leadership & Communication\n\nI recommend starting with "Microservices Migration Plan" task this week.`;
    } else if (lowerQ.includes('ready') || lowerQ.includes('promotion')) {
      return `You're currently at 68% readiness for ${userData.targetRole}. You need:\n\n• 4-6 more months of focused learning\n• Complete 3 major projects\n• Get AWS certification\n• Improve leadership skills by 30%\n\nYou're making great progress!`;
    } else if (lowerQ.includes('certification')) {
      return `For ${userData.targetRole}, I recommend:\n\n1. AWS Solutions Architect (High priority)\n2. Kubernetes Administrator\n3. Leadership & Management courses\n\nThese align well with your career goals and skill gaps.`;
    } else if (lowerQ.includes('interview')) {
      return `For ${userData.targetRole} interviews, prepare:\n\n1. System Design (most important)\n2. Behavioral/Leadership questions\n3. Technical depth in your domain\n4. Past project experiences\n\nCheck the Interview Readiness section for mock interviews!`;
    } else {
      return `Great question! Based on your profile (${userData.currentRole} → ${userData.targetRole}):\n\n• Focus on your skill gaps (System Design, Leadership)\n• Complete real-world practice tasks\n• Build your portfolio\n• Network with tech leads\n\nI'm here to help - feel free to ask more specific questions!`;
    }
  };

  const handleClearChat = () => {
    setConversationHistory([]);
    toast.info('Chat history cleared');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Career Assistant</h1>
            <p className="text-muted-foreground mt-1">
              Your 24/7 career mentor for {userData.professionalDomain?.split('-').join(' ')}
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={handleClearChat}
              disabled={conversationHistory.length === 0}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Chat
            </Button>
            <Badge className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-purple-500/30 text-purple-400">
              <Sparkles className="w-3 h-3 mr-1" />
              AI-Powered
            </Badge>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-purple-400" />
                Chat with Your Career Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              {/* Chat History */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {conversationHistory.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Start a conversation with your career assistant!</p>
                    <p className="text-sm mt-2">Ask about skills, career growth, or next steps.</p>
                  </div>
                )}
                {conversationHistory.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${
                        msg.type === 'user'
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                          : 'bg-muted border border-border'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line">{msg.text}</p>
                      <p className="text-xs opacity-70 mt-2">{msg.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Suggested Questions */}
              {conversationHistory.length < 6 && (
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-2">Suggested questions:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedQuestions.slice(0, 3).map((question, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => setMessage(question)}
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask about your career, skills, or next steps..."
                  className="flex-1 px-4 py-2 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Smart Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                Smart Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {insights.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`p-3 rounded-lg bg-gradient-to-br ${insight.color}`}
                >
                  <div className="flex items-start gap-3">
                    {insight.icon}
                    <div>
                      <h4 className="font-semibold text-sm mb-1">{insight.title}</h4>
                      <p className="text-xs text-muted-foreground">{insight.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Common Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {suggestedQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left h-auto py-3"
                  onClick={() => setMessage(question)}
                >
                  <span className="text-xs">{question}</span>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Resources */}
          <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <BookOpen className="w-4 h-4 text-purple-400" />
                Recommended Resources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="p-2 rounded bg-muted/50 border border-border">
                <p className="text-xs font-medium mb-1">System Design Interview Guide</p>
                <p className="text-xs text-muted-foreground">Essential reading for your role</p>
              </div>
              <div className="p-2 rounded bg-muted/50 border border-border">
                <p className="text-xs font-medium mb-1">Leadership in Tech</p>
                <p className="text-xs text-muted-foreground">Develop leadership skills</p>
              </div>
              <Button size="sm" variant="outline" className="w-full">
                View All Resources
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}