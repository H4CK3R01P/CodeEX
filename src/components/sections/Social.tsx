import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  UserPlus,
  Search,
  Trophy,
  Target,
  Flame,
  MessageCircle,
  Share2,
  Code,
  CheckCircle2,
  Clock,
  TrendingUp,
  Award,
  Star,
  Heart,
  MessageSquare,
  Send,
  MoreVertical,
  UserCheck,
  UserX,
  Activity,
  Plus,
  X,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { Textarea } from '../ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { toast } from 'sonner@2.0.3';
import { UserData } from '../../App';

interface SocialProps {
  userData: UserData;
}

interface ActivityComment {
  id: number;
  user: string;
  username: string;
  text: string;
  time: string;
}

interface ActivityItem {
  id: number;
  user: string;
  username: string;
  action: string;
  problem?: string;
  difficulty?: string;
  time: string;
  likes: number;
  comments: ActivityComment[];
  language?: string;
  achievement?: string;
  contest?: string;
  rank?: number;
  liked?: boolean;
}

export function Social({ userData }: SocialProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('feed');
  const [commentText, setCommentText] = useState<{ [key: number]: string }>({});
  const [showComments, setShowComments] = useState<{ [key: number]: boolean }>({});
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPostText, setNewPostText] = useState('');
  const [displayCount, setDisplayCount] = useState(4);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Mock data - in production, fetch from backend
  const [friends] = useState([
    {
      id: 1,
      name: 'Alex Johnson',
      username: '@alexj',
      avatar: '',
      streak: 25,
      solved: 234,
      rank: 456,
      status: 'online',
      lastSeen: 'now',
    },
    {
      id: 2,
      name: 'Sarah Chen',
      username: '@sarach',
      avatar: '',
      streak: 18,
      solved: 189,
      rank: 789,
      status: 'online',
      lastSeen: '5m ago',
    },
    {
      id: 3,
      name: 'Mike Wilson',
      username: '@mikew',
      avatar: '',
      streak: 42,
      solved: 312,
      rank: 234,
      status: 'offline',
      lastSeen: '2h ago',
    },
    {
      id: 4,
      name: 'Emma Davis',
      username: '@emmad',
      avatar: '',
      streak: 15,
      solved: 156,
      rank: 1023,
      status: 'online',
      lastSeen: '1m ago',
    },
  ]);

  // Activity feed with proper state management
  const [activityFeed, setActivityFeed] = useState<ActivityItem[]>([
    {
      id: 1,
      user: 'Alex Johnson',
      username: '@alexj',
      action: 'solved',
      problem: 'Two Sum',
      difficulty: 'Easy',
      time: '5m ago',
      likes: 12,
      comments: [],
      language: 'JavaScript',
      liked: false,
    },
    {
      id: 2,
      user: 'Sarah Chen',
      username: '@sarach',
      action: 'achieved',
      achievement: '100 Day Streak',
      time: '15m ago',
      likes: 45,
      comments: [],
      liked: false,
    },
    {
      id: 3,
      user: 'Mike Wilson',
      username: '@mikew',
      action: 'solved',
      problem: 'Longest Palindromic Substring',
      difficulty: 'Medium',
      time: '1h ago',
      likes: 23,
      comments: [],
      language: 'Python',
      liked: false,
    },
    {
      id: 4,
      user: 'Emma Davis',
      username: '@emmad',
      action: 'ranked',
      contest: 'Weekly Contest 372',
      rank: 234,
      time: '2h ago',
      likes: 18,
      comments: [],
      liked: false,
    },
    // Additional mock data for infinite scroll
    {
      id: 5,
      user: 'Alex Johnson',
      username: '@alexj',
      action: 'solved',
      problem: 'Binary Search',
      difficulty: 'Easy',
      time: '3h ago',
      likes: 8,
      comments: [],
      language: 'Java',
      liked: false,
    },
    {
      id: 6,
      user: 'Mike Wilson',
      username: '@mikew',
      action: 'achieved',
      achievement: '50 Problems Solved',
      time: '4h ago',
      likes: 32,
      comments: [],
      liked: false,
    },
    {
      id: 7,
      user: 'Sarah Chen',
      username: '@sarach',
      action: 'solved',
      problem: 'Merge K Sorted Lists',
      difficulty: 'Hard',
      time: '5h ago',
      likes: 67,
      comments: [],
      language: 'C++',
      liked: false,
    },
    {
      id: 8,
      user: 'Emma Davis',
      username: '@emmad',
      action: 'ranked',
      contest: 'Weekly Contest 371',
      rank: 189,
      time: '6h ago',
      likes: 25,
      comments: [],
      liked: false,
    },
  ]);

  const [friendRequests, setFriendRequests] = useState([
    { id: 1, name: 'John Doe', username: '@johnd', mutualFriends: 3 },
    { id: 2, name: 'Jane Smith', username: '@janes', mutualFriends: 5 },
  ]);

  // Leaderboard data
  const [leaderboard] = useState([
    { id: 1, rank: 1, name: 'Code Master', username: '@codemaster', solved: 1245, points: 15670, change: 0 },
    { id: 2, rank: 2, name: 'Algorithm Pro', username: '@algopro', solved: 1189, points: 14890, change: 1 },
    { id: 3, rank: 3, name: 'Mike Wilson', username: '@mikew', solved: 312, points: 4560, change: -1 },
    { id: 4, rank: 4, name: 'Data Wizard', username: '@datawiz', solved: 298, points: 4321, change: 2 },
    { id: 5, rank: 5, name: 'Alex Johnson', username: '@alexj', solved: 234, points: 3890, change: 0 },
    { id: 6, rank: 6, name: userData.name, username: '@' + userData.name.toLowerCase().replace(/\s+/g, ''), solved: 156, points: 2340, change: 3, isCurrentUser: true },
    { id: 7, rank: 7, name: 'Sarah Chen', username: '@sarach', solved: 189, points: 2890, change: -2 },
    { id: 8, rank: 8, name: 'Emma Davis', username: '@emmad', solved: 156, points: 2340, change: 1 },
    { id: 9, rank: 9, name: 'Tech Ninja', username: '@techninja', solved: 145, points: 2156, change: 0 },
    { id: 10, rank: 10, name: 'Code Warrior', username: '@codewar', solved: 134, points: 2045, change: -1 },
  ]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'medium':
        return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'hard':
        return 'text-red-500 bg-red-500/10 border-red-500/20';
      default:
        return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };

  const handleAddFriend = (name: string) => {
    toast.success(`Friend request sent to ${name}!`);
    // In production: API call here
  };

  const handleAcceptRequest = (id: number, name: string) => {
    // Optimistic update: remove from requests
    setFriendRequests(prev => prev.filter(req => req.id !== id));
    toast.success(`You are now friends with ${name}!`);
    // In production: API call here
  };

  const handleRejectRequest = (id: number, name: string) => {
    // Optimistic update: remove from requests
    setFriendRequests(prev => prev.filter(req => req.id !== id));
    toast.info(`Friend request from ${name} declined.`);
    // In production: API call here
  };

  const handleLike = (activityId: number) => {
    // Optimistic update
    setActivityFeed(prev => prev.map(activity =>
      activity.id === activityId
        ? {
            ...activity,
            likes: activity.liked ? activity.likes - 1 : activity.likes + 1,
            liked: !activity.liked
          }
        : activity
    ));
    toast.success(activityFeed.find(a => a.id === activityId)?.liked ? 'Unliked!' : 'Liked!');
    // In production: API call here
  };

  const handleComment = (activityId: number) => {
    const text = commentText[activityId]?.trim();
    if (!text) return;

    // Optimistic update: add comment to feed
    const newComment: ActivityComment = {
      id: Date.now(),
      user: userData.name,
      username: '@' + userData.name.toLowerCase().replace(/\s+/g, ''),
      text: text,
      time: 'Just now',
    };

    setActivityFeed(prev => prev.map(activity =>
      activity.id === activityId
        ? { ...activity, comments: [...activity.comments, newComment] }
        : activity
    ));

    setCommentText(prev => ({ ...prev, [activityId]: '' }));
    toast.success('Comment posted!');
    // In production: API call here
  };

  const toggleComments = (activityId: number) => {
    setShowComments(prev => ({
      ...prev,
      [activityId]: !prev[activityId]
    }));
  };

  const handleCreatePost = () => {
    if (!newPostText.trim()) {
      toast.error('Please write something!');
      return;
    }

    // Optimistic update: add new post to feed
    const newPost: ActivityItem = {
      id: Date.now(),
      user: userData.name,
      username: '@' + userData.name.toLowerCase().replace(/\s+/g, ''),
      action: 'posted',
      time: 'Just now',
      likes: 0,
      comments: [],
      liked: false,
    };

    setActivityFeed(prev => [newPost, ...prev]);
    setNewPostText('');
    setShowCreatePost(false);
    toast.success('Post created successfully!');
    // In production: API call here
  };

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    // Simulate loading
    setTimeout(() => {
      setDisplayCount(prev => Math.min(prev + 4, activityFeed.length));
      setIsLoadingMore(false);
      if (displayCount + 4 >= activityFeed.length) {
        toast.info('All posts loaded!');
      }
    }, 1000);
    // In production: Fetch more data from API
  };

  const renderActivityCard = (activity: ActivityItem) => {
    const getActivityContent = () => {
      switch (activity.action) {
        case 'solved':
          return (
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-muted-foreground">solved</span>
                <span className="font-semibold text-purple-500">{activity.problem}</span>
                {activity.difficulty && (
                  <Badge className={getDifficultyColor(activity.difficulty)}>
                    {activity.difficulty}
                  </Badge>
                )}
                {activity.language && (
                  <Badge variant="outline" className="text-blue-500">
                    <Code className="w-3 h-3 mr-1" />
                    {activity.language}
                  </Badge>
                )}
              </div>
            </div>
          );
        case 'achieved':
          return (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">unlocked achievement</span>
              <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white border-0">
                <Trophy className="w-3 h-3 mr-1" />
                {activity.achievement}
              </Badge>
            </div>
          );
        case 'ranked':
          return (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-muted-foreground">ranked</span>
              <span className="font-semibold text-orange-500">#{activity.rank}</span>
              <span className="text-muted-foreground">in</span>
              <span className="font-semibold text-blue-500">{activity.contest}</span>
            </div>
          );
        case 'posted':
          return (
            <div className="text-foreground">
              {newPostText || 'Shared an update'}
            </div>
          );
        default:
          return null;
      }
    };

    return (
      <motion.div
        key={activity.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.01 }}
        className="p-4 rounded-xl border border-border/50 bg-card/30 hover:bg-card/50 transition-all"
      >
        <div className="space-y-3">
          {/* User Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 border-2 border-purple-500/50">
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                  {activity.user
                    .split(' ')
                    .map((n: string) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{activity.user}</p>
                <p className="text-sm text-muted-foreground">{activity.username}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{activity.time}</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </DropdownMenuItem>
                  <DropdownMenuItem>Report</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Activity Content */}
          <div className="pl-[52px]">{getActivityContent()}</div>

          {/* Interaction Buttons */}
          <div className="flex items-center gap-4 pl-[52px] pt-2 border-t border-border/30">
            <Button
              variant="ghost"
              size="sm"
              className={`transition-colors ${activity.liked ? 'text-pink-500' : 'text-muted-foreground hover:text-pink-500'}`}
              onClick={() => handleLike(activity.id)}
            >
              <Heart className={`w-4 h-4 mr-1 ${activity.liked ? 'fill-pink-500' : ''}`} />
              {activity.likes}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-blue-500 transition-colors"
              onClick={() => toggleComments(activity.id)}
            >
              <MessageSquare className="w-4 h-4 mr-1" />
              {activity.comments.length}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-green-500 transition-colors"
              onClick={() => toast.info('Share feature coming soon!')}
            >
              <Share2 className="w-4 h-4 mr-1" />
              Share
            </Button>
          </div>

          {/* Comments Section */}
          <AnimatePresence>
            {showComments[activity.id] && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="pl-[52px] space-y-3 border-t border-border/30 pt-3 mt-3"
              >
                {/* Existing Comments */}
                {activity.comments.length > 0 && (
                  <div className="space-y-2">
                    {activity.comments.map((comment) => (
                      <div key={comment.id} className="flex gap-2">
                        <Avatar className="w-7 h-7 border border-purple-500/30">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-xs">
                            {comment.user.split(' ').map((n: string) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 bg-muted/50 rounded-lg p-2">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-semibold">{comment.user}</span>
                            <span className="text-xs text-muted-foreground">{comment.time}</span>
                          </div>
                          <p className="text-sm">{comment.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Comment Input */}
                <div className="flex gap-2">
                  <Avatar className="w-8 h-8 border-2 border-purple-500/50">
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs">
                      {userData.name.split(' ').map((n: string) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 flex gap-2">
                    <Input
                      placeholder="Write a comment..."
                      value={commentText[activity.id] || ''}
                      onChange={(e) => setCommentText(prev => ({
                        ...prev,
                        [activity.id]: e.target.value
                      }))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleComment(activity.id);
                        }
                      }}
                      className="flex-1"
                    />
                    <Button
                      size="sm"
                      onClick={() => handleComment(activity.id)}
                      disabled={!commentText[activity.id]?.trim()}
                      className="bg-gradient-to-r from-purple-500 to-blue-500"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
          Social Hub
        </h1>
        <p className="text-muted-foreground">
          Connect with friends, share achievements, and learn together
        </p>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="feed">Activity Feed</TabsTrigger>
          <TabsTrigger value="friends">
            Friends
            <Badge className="ml-2 bg-purple-500">{friends.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="discover">
            Discover
            {friendRequests.length > 0 && (
              <Badge className="ml-2 bg-red-500">{friendRequests.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Activity Feed Tab */}
        <TabsContent value="feed" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Feed */}
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-purple-500" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {activityFeed.map((activity) => renderActivityCard(activity))}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Top Friends */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    Top Performers
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {friends
                    .sort((a, b) => b.solved - a.solved)
                    .slice(0, 3)
                    .map((friend, index) => (
                      <div
                        key={friend.id}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                            index === 0
                              ? 'bg-gradient-to-br from-yellow-500 to-amber-500'
                              : index === 1
                              ? 'bg-gradient-to-br from-gray-400 to-gray-500'
                              : 'bg-gradient-to-br from-orange-600 to-orange-700'
                          } text-white`}
                        >
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{friend.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {friend.solved} solved
                          </p>
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>

              {/* Online Friends */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-green-500" />
                    Online Now
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {friends
                    .filter((f) => f.status === 'online')
                    .map((friend) => (
                      <div
                        key={friend.id}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                      >
                        <div className="relative">
                          <Avatar className="w-8 h-8 border-2 border-green-500">
                            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-sm">
                              {friend.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{friend.name}</p>
                          <p className="text-xs text-muted-foreground">
                            🔥 {friend.streak} day streak
                          </p>
                        </div>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Friends Tab */}
        <TabsContent value="friends" className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search friends..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              <UserPlus className="w-4 h-4 mr-2" />
              Add Friend
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {friends
              .filter((f) =>
                f.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((friend) => (
                <motion.div
                  key={friend.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar className="w-12 h-12 border-2 border-purple-500/50">
                              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                                {friend.name
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')}
                              </AvatarFallback>
                            </Avatar>
                            {friend.status === 'online' && (
                              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-background" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold">{friend.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {friend.username}
                            </p>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="grid grid-cols-3 gap-2">
                        <div className="text-center">
                          <div className="text-lg font-bold text-orange-500">
                            {friend.streak}
                          </div>
                          <div className="text-xs text-muted-foreground">Streak</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-purple-500">
                            {friend.solved}
                          </div>
                          <div className="text-xs text-muted-foreground">Solved</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-500">
                            #{friend.rank}
                          </div>
                          <div className="text-xs text-muted-foreground">Rank</div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() =>
                            toast.info(`Opening chat with ${friend.name}...`)
                          }
                        >
                          <MessageCircle className="w-4 h-4 mr-1" />
                          Chat
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Trophy className="w-4 h-4 mr-1" />
                          Challenge
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
          </div>
        </TabsContent>

        {/* Discover Tab */}
        <TabsContent value="discover" className="space-y-6">
          {friendRequests.length > 0 && (
            <Card className="border-purple-500/20 bg-purple-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-purple-500" />
                  Friend Requests
                  <Badge className="ml-2 bg-purple-500">
                    {friendRequests.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {friendRequests.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-card/30"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10 border-2 border-purple-500/50">
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                          {request.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{request.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {request.mutualFriends} mutual friends
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                        onClick={() => handleAcceptRequest(request.name)}
                      >
                        <UserCheck className="w-4 h-4 mr-1" />
                        Accept
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRejectRequest(request.name)}
                      >
                        <UserX className="w-4 h-4 mr-1" />
                        Decline
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                Suggested Friends
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: 'David Lee', username: '@davidl', mutualFriends: 4, rank: 567 },
                { name: 'Lisa Wang', username: '@lisaw', mutualFriends: 6, rank: 423 },
                {
                  name: 'Tom Brown',
                  username: '@tomb',
                  mutualFriends: 2,
                  rank: 891,
                },
              ].map((user) => (
                <div
                  key={user.username}
                  className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-card/30 hover:bg-card/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 border-2 border-blue-500/50">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                        {user.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {user.mutualFriends} mutual • Rank #{user.rank}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAddFriend(user.name)}
                  >
                    <UserPlus className="w-4 h-4 mr-1" />
                    Add Friend
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
