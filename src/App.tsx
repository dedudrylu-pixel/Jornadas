import { useState, useCallback } from 'react';
import TopHeader from '@/components/TopHeader';
import StoryBar from '@/components/StoryBar';
import StoryViewer from '@/components/StoryViewer';
import CycleModal from '@/components/CycleModal';
import FeedCard from '@/components/FeedCard';
import CommentSheet from '@/components/CommentSheet';
import BottomNav from '@/components/BottomNav';
import type { Tab } from '@/components/BottomNav';
import ExploreScreen from '@/components/ExploreScreen';
import AchievementsScreen from '@/components/AchievementsScreen';
import CreateScreen from '@/components/CreateScreen';
import ProfileScreen from '@/components/ProfileScreen';
import TermsScreen from '@/components/TermsScreen';
import LoginScreen from '@/components/LoginScreen';
import SplashScreen from '@/components/SplashScreen';
import AdminDashboard from '@/components/AdminDashboard';
import { AuthProvider, useAuth } from '@/lib/auth';
import { stories, posts, currentUser } from '@/data';

function AppContent() {
  const { session, loading, isAdmin } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [cycleStoryIndex, setCycleStoryIndex] = useState<number | null>(null);
  const [storyIndex, setStoryIndex] = useState<number | null>(null);
  const [commentPostId, setCommentPostId] = useState<string | null>(null);
  const [showTerms, setShowTerms] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  const handleStorySelect = useCallback((index: number) => setCycleStoryIndex(index), []);
  const handleCycleClose = useCallback(() => setCycleStoryIndex(null), []);
  const handleCycleViewStory = useCallback((index: number) => {
    setCycleStoryIndex(null);
    setStoryIndex(index);
  }, []);
  const handleStoryClose = useCallback(() => setStoryIndex(null), []);

  const commentPost = posts.find((p) => p.id === commentPostId) || null;

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="animate-fade-in">
            <StoryBar stories={stories} onSelect={handleStorySelect} />
            <div>
              {posts.map((post) => (
                <FeedCard
                  key={post.id}
                  post={post}
                  onCommentClick={() => setCommentPostId(post.id)}
                />
              ))}
            </div>
            <div className="h-24" />
          </div>
        );
      case 'explore':
        return <ExploreScreen onOpenStory={() => setCycleStoryIndex(0)} />;
      case 'achievements':
        return <AchievementsScreen />;
      case 'profile':
        return (
          <ProfileScreen
            onOpenComment={(id) => setCommentPostId(id)}
            onOpenTerms={() => setShowTerms(true)}
            onOpenAdmin={() => setShowAdmin(true)}
            isAdmin={isAdmin}
          />
        );
      case 'create':
        return null;
    }
  };

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-emerald-500/30 border-t-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto w-full max-w-[468px] min-h-screen bg-black relative shadow-2xl">
        {!session ? (
          <LoginScreen onOpenTerms={() => setShowTerms(true)} />
        ) : (
          <>
            {activeTab !== 'create' && <TopHeader />}
            {renderContent()}

            {cycleStoryIndex !== null && (
              <CycleModal
                story={stories[cycleStoryIndex]}
                storyIndex={cycleStoryIndex}
                onClose={handleCycleClose}
                onViewStory={handleCycleViewStory}
              />
            )}

            {storyIndex !== null && (
              <StoryViewer
                stories={stories}
                initialIndex={storyIndex}
                onClose={handleStoryClose}
              />
            )}

            {commentPost && (
              <CommentSheet post={commentPost} onClose={() => setCommentPostId(null)} />
            )}

            {activeTab === 'create' && (
              <CreateScreen onClose={() => setActiveTab('home')} />
            )}

            <BottomNav
              active={activeTab === 'create' ? 'home' : activeTab}
              onChange={setActiveTab}
              avatar={currentUser.avatar}
            />
          </>
        )}

        {showTerms && (
          <div className="absolute inset-0 z-50 bg-black overflow-y-auto">
            <TermsScreen onBack={() => setShowTerms(false)} />
          </div>
        )}

        {showAdmin && session && (
          <div className="absolute inset-0 z-50 bg-black overflow-y-auto">
            <AdminDashboard onBack={() => setShowAdmin(false)} />
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
