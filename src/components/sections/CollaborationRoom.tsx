import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Users,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Send,
  Share2,
  Copy,
  UserPlus,
  Settings,
  Play,
  StopCircle,
  MessageSquare,
  Code,
  ChevronRight,
  Crown,
  Link2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { toast } from 'sonner@2.0.3';
import { CodeEditor } from '../CodeEditor';
import { UserData } from '../../App';

interface CollaborationRoomProps {
  userData: UserData;
  roomId?: string;
}

interface Participant {
  id: string;
  name: string;
  isHost: boolean;
  isOnline: boolean;
  cursor?: { line: number; column: number };
}

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
}

export function CollaborationRoom({ userData, roomId: initialRoomId }: CollaborationRoomProps) {
  const [roomId, setRoomId] = useState(initialRoomId || '');
  const [isInRoom, setIsInRoom] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [sharedCode, setSharedCode] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [showChat, setShowChat] = useState(true);

  const [participants, setParticipants] = useState<Participant[]>([
    {
      id: '1',
      name: userData.name,
      isHost: true,
      isOnline: true,
    },
    {
      id: '2',
      name: 'Alex Johnson',
      isHost: false,
      isOnline: true,
      cursor: { line: 5, column: 12 },
    },
    {
      id: '3',
      name: 'Sarah Chen',
      isHost: false,
      isOnline: true,
      cursor: { line: 8, column: 5 },
    },
  ]);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      userId: '2',
      userName: 'Alex Johnson',
      message: 'Hey! Ready to solve this problem together?',
      timestamp: new Date(Date.now() - 300000),
    },
    {
      id: '2',
      userId: '1',
      userName: userData.name,
      message: "Yes! Let's start with understanding the problem.",
      timestamp: new Date(Date.now() - 240000),
    },
    {
      id: '3',
      userId: '3',
      userName: 'Sarah Chen',
      message: 'I think we should use a hash map for this.',
      timestamp: new Date(Date.now() - 180000),
    },
  ]);

  const generateRoomId = () => {
    return 'room-' + Math.random().toString(36).substr(2, 9);
  };

  const handleCreateRoom = () => {
    const newRoomId = generateRoomId();
    setRoomId(newRoomId);
    setIsHost(true);
    setIsInRoom(true);
    toast.success('Collaboration room created! 🎉');
  };

  const handleJoinRoom = () => {
    if (!roomId.trim()) {
      toast.error('Please enter a room ID');
      return;
    }
    setIsHost(false);
    setIsInRoom(true);
    toast.success('Joined collaboration room! 👋');
  };

  const handleLeaveRoom = () => {
    setIsInRoom(false);
    setRoomId('');
    toast.info('Left the collaboration room');
  };

  const handleCopyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    toast.success('Room ID copied to clipboard!');
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: '1',
      userName: userData.name,
      message: chatMessage,
      timestamp: new Date(),
    };

    setChatMessages([...chatMessages, newMessage]);
    setChatMessage('');
  };

  const handleCodeChange = (code: string) => {
    setSharedCode(code);
    // In a real implementation, this would sync to other participants via WebSocket
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  if (!isInRoom) {
    return (
      <div className="p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
            Code Collaboration
          </h1>
          <p className="text-muted-foreground">
            Create or join a room to code together in real-time
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Create Room */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-pink-500/10 hover:shadow-xl transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-purple-500" />
                  Create New Room
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Start a new collaboration session and invite your friends to join.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Real-time code sync</li>
                    <li>Voice & video chat</li>
                    <li>Shared execution</li>
                    <li>Live cursors</li>
                  </ul>
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  onClick={handleCreateRoom}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Create Room
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Join Room */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 hover:shadow-xl transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link2 className="w-5 h-5 text-blue-500" />
                  Join Existing Room
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Enter a room ID to join an existing collaboration session.
                  </p>
                  <Input
                    placeholder="Enter Room ID (e.g., room-abc123)"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleJoinRoom()}
                    className="border-blue-500/30"
                  />
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                  onClick={handleJoinRoom}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Join Room
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {[
            {
              icon: Code,
              title: 'Real-time Sync',
              description: 'Code changes sync instantly across all participants',
              gradient: 'from-purple-500 to-pink-500',
            },
            {
              icon: Video,
              title: 'Video Chat',
              description: 'Communicate with voice and video while coding',
              gradient: 'from-blue-500 to-cyan-500',
            },
            {
              icon: MessageSquare,
              title: 'Live Chat',
              description: 'Send messages and share ideas in real-time',
              gradient: 'from-orange-500 to-red-500',
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Card className="border-border/50 bg-card/50 hover:shadow-lg transition-all">
                <CardContent className="p-6 text-center space-y-3">
                  <div
                    className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} bg-opacity-10`}
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Top Bar */}
      <div className="bg-card/50 backdrop-blur-xl border-b border-border/50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="font-bold">Collaboration Room</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Room ID:</span>
                <code className="px-2 py-1 bg-muted rounded text-purple-500">
                  {roomId}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2"
                  onClick={handleCopyRoomId}
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Video Controls */}
            <Button
              variant={isVideoOn ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setIsVideoOn(!isVideoOn);
                toast.info(isVideoOn ? 'Video turned off' : 'Video turned on');
              }}
              className={
                isVideoOn
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                  : ''
              }
            >
              {isVideoOn ? (
                <Video className="w-4 h-4" />
              ) : (
                <VideoOff className="w-4 h-4" />
              )}
            </Button>

            <Button
              variant={isMicOn ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setIsMicOn(!isMicOn);
                toast.info(isMicOn ? 'Microphone muted' : 'Microphone unmuted');
              }}
              className={
                isMicOn ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : ''
              }
            >
              {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowChat(!showChat)}
            >
              <MessageSquare className="w-4 h-4" />
            </Button>

            <Separator orientation="vertical" className="h-6" />

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                handleCopyRoomId();
              }}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Invite
            </Button>

            <Button variant="outline" size="sm" onClick={handleLeaveRoom}>
              Leave Room
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Participants */}
        <div className="w-64 border-r border-border/50 bg-card/30 p-4 space-y-4">
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-500" />
              Participants ({participants.length})
            </h3>
            <div className="space-y-2">
              {participants.map((participant) => (
                <div
                  key={participant.id}
                  className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="relative">
                    <Avatar className="w-8 h-8 border-2 border-purple-500/50">
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs">
                        {participant.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    {participant.isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {participant.name}
                      {participant.isHost && (
                        <Crown className="inline w-3 h-3 ml-1 text-yellow-500" />
                      )}
                    </p>
                    {participant.cursor && (
                      <p className="text-xs text-muted-foreground">
                        Line {participant.cursor.line}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={handleCopyRoomId}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Invite More
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
            >
              <Settings className="w-4 h-4 mr-2" />
              Room Settings
            </Button>
          </div>
        </div>

        {/* Center - Code Editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto">
            <CodeEditor
              defaultCode={sharedCode}
              onChange={handleCodeChange}
              onRun={async () => {
                toast.info('Running code for all participants...');
              }}
              onSubmit={async () => {
                toast.success('Code submitted!');
              }}
              showSubmit={true}
            />
          </div>
        </div>

        {/* Right Sidebar - Chat */}
        {showChat && (
          <div className="w-80 border-l border-border/50 bg-card/30 flex flex-col">
            <div className="p-4 border-b border-border/50">
              <h3 className="font-semibold flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-500" />
                Chat
              </h3>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`space-y-1 ${
                      msg.userId === '1' ? 'text-right' : 'text-left'
                    }`}
                  >
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {msg.userId !== '1' && (
                        <>
                          <span className="font-medium">{msg.userName}</span>
                          <span>•</span>
                        </>
                      )}
                      <span>{formatTime(msg.timestamp)}</span>
                    </div>
                    <div
                      className={`inline-block px-3 py-2 rounded-lg text-sm ${
                        msg.userId === '1'
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                          : 'bg-muted'
                      }`}
                    >
                      {msg.message}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-border/50">
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button
                  size="icon"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  onClick={handleSendMessage}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
