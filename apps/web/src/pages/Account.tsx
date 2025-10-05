import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStore } from '@/state/useStore';
import { useUserStats } from '@/hooks/useUserStats';
import { Leaf, LogOut, Edit3, Sun, Moon, Droplets, Trophy, Sprout, TreePine, Flower2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import HabitCarousel from '@/components/HabitCarousel';
import { CarouselSlide } from '@/components/HabitCarousel';
import { Header } from '@/components/Header';

const Account = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [theme, setTheme] = useState('nature');
  const habits = useStore(state => state.habits);
  const { signout, user } = useStore();
  const navigate = useNavigate();
  const { totalHabits, currentStreak, longestStreak, totalCompletions, completionRate } = useUserStats();

  // Sample achievements - in a real app, these would be calculated based on user activity
  const achievements = [
    { id: 1, name: 'First Steps', description: 'Complete your first habit', icon: '🌱' },
    { id: 2, name: 'Consistency King', description: '7-day streak', icon: '🔥' },
    { id: 3, name: 'Habit Master', description: 'Track 5 habits', icon: '🏆' },
    { id: 4, name: 'Early Bird', description: 'Morning habit completed', icon: '🌅' },
  ];

  // Create carousel slides for user achievements and milestones
  const carouselSlides: CarouselSlide[] = [
    {
      id: '1',
      title: 'New Bloom Achieved!',
      text: 'You\'ve unlocked the rare Bloom stage for "Morning Meditation"! 🌸',
      icon: '🌸',
      variant: 'achievement'
    },
    {
      id: '2',
      title: 'Consistency Streak',
      text: '7-day streak with "Daily Reading" - your knowledge garden is flourishing!',
      icon: '📚',
      variant: 'plant'
    },
    {
      id: '3',
      title: 'Weekly Milestone',
      text: 'You\'ve completed 21 habits this week. Keep growing! 🌿',
      icon: '🌿',
      variant: 'stats'
    },
    {
      id: '4',
      title: 'Motivational Insight',
      text: '"The best time to plant a tree was 20 years ago. The second best time is now."',
      icon: '🌳',
      variant: 'quote'
    },
    {
      id: '5',
      title: 'Garden Growth',
      text: 'Your habit garden now has 5 flourishing plants. What will you grow next?',
      icon: '🌱',
      variant: 'plant'
    },
  ];

  const handleSaveProfile = () => {
    setIsEditModalOpen(false);
    toast({
      title: "Profile updated 🌿",
      description: "Your profile has been successfully updated.",
    });
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await signout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate('/signin');
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Get user's initials for avatar fallback
  const getUserInitials = () => {
    if (!user?.displayName) return 'U';
    return user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <Header />
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800">My Account</h1>
          <p className="text-gray-600">Manage your profile and track your progress</p>
        </motion.div>

        {/* Account Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="mb-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
            <CardHeader className="flex flex-row items-center gap-6 pb-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 260, 
                  damping: 20,
                  delay: 0.2 
                }}
              >
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user?.avatarUrl} alt={user?.displayName} />
                  <AvatarFallback className="bg-green-100 text-green-800 text-xl">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
              <div className="flex-1">
                <CardTitle className="text-2xl">{user?.displayName || 'User'}</CardTitle>
                <CardDescription>{user?.email || 'user@example.com'}</CardDescription>
              </div>
              <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Edit3 className="h-4 w-4" />
                    Edit Profile
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] bg-white rounded-2xl">
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="theme" className="text-right">
                        Theme
                      </Label>
                      <Select value={theme} onValueChange={setTheme}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">
                            <div className="flex items-center gap-2">
                              <Sun className="h-4 w-4" />
                              Light
                            </div>
                          </SelectItem>
                          <SelectItem value="dark">
                            <div className="flex items-center gap-2">
                              <Moon className="h-4 w-4" />
                              Dark
                            </div>
                          </SelectItem>
                          <SelectItem value="nature">
                            <div className="flex items-center gap-2">
                              <Leaf className="h-4 w-4" />
                              Nature
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveProfile}>Save Changes</Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Button variant="outline" className="gap-2" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-700">{totalHabits}</div>
                  <div className="text-sm text-green-600">Total Habits</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-700">{currentStreak}</div>
                  <div className="text-sm text-blue-600">Current Streak</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-700">{longestStreak}</div>
                  <div className="text-sm text-purple-600">Longest Streak</div>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-amber-700">{completionRate}%</div>
                  <div className="text-sm text-amber-600">Completion Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Achievements Section */}
          <Card className="mb-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-500" />
                Achievements
              </CardTitle>
              <CardDescription>Your milestones and accomplishments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-lg text-center border border-amber-200">
                    <div className="text-3xl mb-2">{achievement.icon}</div>
                    <div className="font-semibold text-amber-800">{achievement.name}</div>
                    <div className="text-xs text-amber-600">{achievement.description}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Garden Highlights Carousel */}
          <Card className="mb-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flower2 className="h-5 w-5 text-green-500" />
                Garden Highlights
              </CardTitle>
              <CardDescription>Recent milestones in your habit garden</CardDescription>
            </CardHeader>
            <CardContent>
              <HabitCarousel slides={carouselSlides} className="py-4" />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Account;