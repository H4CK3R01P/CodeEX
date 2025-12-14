import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Coins, TrendingUp, ShoppingBag, Gift, Award, Zap } from 'lucide-react';

interface CoinsSectionProps {
  coins: number;
}

export function CoinsSection({ coins }: CoinsSectionProps) {
  const recentTransactions = [
    { id: '1', type: 'earned', amount: 50, description: 'Completed Daily Challenge', date: 'Today' },
    { id: '2', type: 'earned', amount: 100, description: 'Won Weekly Contest', date: 'Yesterday' },
    { id: '3', type: 'spent', amount: 30, description: 'Unlocked Premium Hint', date: '2 days ago' },
    { id: '4', type: 'earned', amount: 25, description: 'Solved Hard Problem', date: '3 days ago' },
    { id: '5', type: 'earned', amount: 75, description: 'Completed Learning Module', date: '5 days ago' },
  ];

  const rewards = [
    { id: '1', name: '1 Month Premium', cost: 500, icon: '👑', description: 'Access all premium features' },
    { id: '2', name: 'Problem Hints Pack', cost: 100, icon: '💡', description: 'Get hints for 10 problems' },
    { id: '3', name: 'Custom Profile Badge', cost: 200, icon: '🎨', description: 'Personalize your profile' },
    { id: '4', name: 'Contest Entry Fee Waiver', cost: 150, icon: '🎫', description: 'Free entry to premium contest' },
    { id: '5', name: 'Video Solution Access', cost: 75, icon: '📹', description: 'Unlock video solutions' },
    { id: '6', name: 'Exclusive Mock Test', cost: 250, icon: '📝', description: 'Premium quality mock test' },
  ];

  const earnOpportunities = [
    { task: 'Complete Daily Challenge', reward: 50 },
    { task: 'Solve 3 Problems', reward: 75 },
    { task: 'Participate in Contest', reward: 100 },
    { task: 'Complete a Learning Module', reward: 80 },
    { task: 'Maintain 7-Day Streak', reward: 150 },
    { task: 'Refer a Friend', reward: 200 },
  ];

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-gray-900 mb-2">Coins & Rewards</h2>
        <p className="text-gray-600">Earn coins and redeem them for exciting rewards</p>
      </div>

      {/* Coin Balance */}
      <Card className="mb-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <Coins className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Your Balance</div>
                <div className="text-3xl text-gray-900">{coins.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Coins</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600 mb-1">This Month</div>
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span>+250 coins</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="earn" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="earn">Earn</TabsTrigger>
          <TabsTrigger value="spend">Spend</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="earn" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-600" />
                Ways to Earn Coins
              </CardTitle>
              <CardDescription>Complete tasks and activities to earn more coins</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {earnOpportunities.map((opportunity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <Award className="w-5 h-5 text-indigo-600" />
                      </div>
                      <span className="text-gray-900">{opportunity.task}</span>
                    </div>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      +{opportunity.reward} coins
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Gift className="w-8 h-8 text-purple-600 flex-shrink-0" />
                <div>
                  <h3 className="text-gray-900 mb-2">Bonus Opportunity!</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Complete all 3 daily challenges this week to earn a bonus of 200 coins!
                  </p>
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    View Challenge
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="spend" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-indigo-600" />
                Rewards Store
              </CardTitle>
              <CardDescription>Redeem your coins for valuable rewards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {rewards.map((reward) => (
                  <Card key={reward.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center text-3xl">
                          {reward.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-gray-900 mb-1">{reward.name}</h4>
                          <p className="text-sm text-gray-600 mb-3">{reward.description}</p>
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                              <Coins className="w-3 h-3 mr-1" />
                              {reward.cost}
                            </Badge>
                            <Button 
                              size="sm" 
                              disabled={coins < reward.cost}
                              className={coins >= reward.cost ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : ''}
                            >
                              {coins >= reward.cost ? 'Redeem' : 'Not Enough'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>View all your coin transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === 'earned' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        <Coins className={`w-5 h-5 ${
                          transaction.type === 'earned' ? 'text-green-600' : 'text-red-600'
                        }`} />
                      </div>
                      <div>
                        <div className="text-gray-900">{transaction.description}</div>
                        <div className="text-sm text-gray-600">{transaction.date}</div>
                      </div>
                    </div>
                    <div className={`text-lg ${
                      transaction.type === 'earned' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'earned' ? '+' : '-'}{transaction.amount}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
