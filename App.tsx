

import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import DirectoryPage from './pages/DirectoryPage';
import PlumberDetailPage from './pages/PlumberDetailPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import AboutUsPage from './pages/AboutUsPage';
import ContactUsPage from './pages/ContactUsPage';
import { Plumber, Page } from './types';
import { supabase } from './lib/supabase';
import { useToast } from './contexts/ToastContext';
import { CheckCircleIcon, XCircleIcon, XIcon } from './components/IconComponents';
import ScrollToTopButton from './components/ScrollToTopButton';
import GDPRBanner from './components/GDPRBanner';

type PlumberFormData = Omit<Plumber, 'id' | 'ratings' | 'imageUrl' | 'likes' | 'dislikes' | 'comment_count' | 'created_at'> & { imageUrl?: string };

const ToastContainer: React.FC = () => {
    const { toasts, removeToast } = useToast();

    if (toasts.length === 0) {
        return null;
    }

    const toastStyles = {
        success: {
            bg: 'bg-green-50',
            border: 'border-green-400',
            text: 'text-green-800',
            icon: <CheckCircleIcon className="w-6 h-6 text-green-500" />
        },
        error: {
            bg: 'bg-red-50',
            border: 'border-red-400',
            text: 'text-red-800',
            icon: <XCircleIcon className="w-6 h-6 text-red-500" />
        }
    };

    return (
        <div className="fixed top-5 right-5 z-[100] space-y-3 w-full max-w-xs">
            {toasts.map(toast => {
                const styles = toastStyles[toast.type];
                return (
                    <div
                        key={toast.id}
                        className={`w-full ${styles.bg} ${styles.border} ${styles.text} rounded-lg shadow-lg p-4 border flex items-start space-x-3 rtl:space-x-reverse`}
                    >
                        <div className="flex-shrink-0">{styles.icon}</div>
                        <div className="flex-1 text-sm font-medium">{toast.message}</div>
                        <button onClick={() => removeToast(toast.id)} className="flex-shrink-0">
                            <XIcon className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                        </button>
                    </div>
                );
            })}
        </div>
    );
};

const App: React.FC = () => {
  const [page, setPage] = useState<Page>('home');
  const [plumbers, setPlumbers] = useState<Plumber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [selectedPlumber, setSelectedPlumber] = useState<Plumber | null>(null);
  const [userIp, setUserIp] = useState<string | null>(null);
  const [userVotes, setUserVotes] = useState<{ [key: string]: 'like' | 'dislike' }>({});
  const { addToast } = useToast();

  useEffect(() => {
    const fetchIpAndVotes = async () => {
        try {
            const ipResponse = await fetch('https://api.ipify.org?format=json');
            if (!ipResponse.ok) throw new Error('Failed to fetch IP');
            const ipData = await ipResponse.json();
            const fetchedIp = ipData.ip;
            setUserIp(fetchedIp);

            const { data: votesData, error: votesError } = await supabase
                .from('votes')
                .select('plumber_id, vote_type')
                .eq('ip_address', fetchedIp);
            
            if (votesError) {
                console.error('Error fetching user votes:', votesError.message);
                addToast("Error loading voting data. Functionality may be limited.", 'error');
                return;
            }

            if (votesData) {
                const votesMap = votesData.reduce((acc, vote) => {
                    acc[vote.plumber_id] = vote.vote_type as 'like' | 'dislike';
                    return acc;
                }, {} as { [key: string]: 'like' | 'dislike' });
                setUserVotes(votesMap);
            }
        } catch (error) {
            console.error("Could not initialize voting system:", error);
            addToast("Could not initialize voting system. Voting may be disabled.", 'error');
        }
    };

    fetchIpAndVotes();
  }, [addToast]);

  const fetchPlumbers = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);

    const { data: plumbersData, error: plumbersError } = await supabase
      .from('plumbers')
      .select('*');

    if (plumbersError) {
      console.error('Error fetching plumbers:', plumbersError.message || plumbersError);
      setFetchError(plumbersError.message);
      setPlumbers([]);
      setIsLoading(false);
      return;
    }

    const { data: commentsData, error: commentsError } = await supabase
      .from('comments')
      .select('plumber_id');

    if (commentsError) {
      console.error('Error fetching comments:', commentsError.message);
    }
    
    const commentCounts = commentsData 
        ? commentsData.reduce((acc, comment) => {
            acc[comment.plumber_id] = (acc[comment.plumber_id] || 0) + 1;
            return acc;
          }, {} as { [key: string]: number })
        : {};

    const plumbersWithCounts = plumbersData.map(plumber => ({
      ...plumber,
      likes: plumber.likes ?? 0,
      dislikes: plumber.dislikes ?? 0,
      comment_count: commentCounts[plumber.id] || 0,
    }));
    
    setPlumbers(plumbersWithCounts);
    setIsLoading(false);
  }, []);
  
  const handleSelectPlumber = useCallback((plumber: Plumber) => {
    setSelectedPlumber(plumber);
    setPage('plumberDetail');
    const url = new URL(window.location.href);
    url.searchParams.set('plumber', plumber.id);
    window.history.pushState({}, '', url);
    window.scrollTo(0, 0);
  }, []);
  
  const handleBackToDirectory = () => {
    setSelectedPlumber(null);
    setPage('directory');
    const url = new URL(window.location.href);
    url.searchParams.delete('plumber');
    window.history.pushState({}, '', url);
  };

  useEffect(() => {
    fetchPlumbers();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(() => {}, () => {});
    }

    const channel = supabase
      .channel('public:plumbers')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'plumbers' },
        (payload) => {
            const newRecord = payload.new as Plumber;
            const oldRecord = payload.old as { id: string };
            
            if (payload.eventType === 'INSERT' && (!newRecord || !newRecord.id)) return;
            if (payload.eventType === 'UPDATE' && (!newRecord || !newRecord.id)) return;
            if (payload.eventType === 'DELETE' && (!oldRecord || !oldRecord.id)) return;

            setPlumbers(currentPlumbers => {
                const existingPlumber = currentPlumbers.find(p => p.id === newRecord.id);
                const currentCommentCount = existingPlumber ? existingPlumber.comment_count : 0;
                
                if (payload.eventType === 'INSERT') {
                    if (currentPlumbers.some(p => p.id === newRecord.id)) return currentPlumbers;
                    return [...currentPlumbers, { ...newRecord, comment_count: 0 }];
                }
                if (payload.eventType === 'UPDATE') {
                    return currentPlumbers.map(p => p.id === newRecord.id ? { ...p, ...newRecord, comment_count: currentCommentCount } : p);
                }
                if (payload.eventType === 'DELETE') {
                    return currentPlumbers.filter(p => p.id !== oldRecord.id);
                }
                return currentPlumbers;
            });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchPlumbers]);

  useEffect(() => {
    if (isLoading) return;

    const urlParams = new URLSearchParams(window.location.search);
    const plumberId = urlParams.get('plumber');
    if (plumberId && plumbers.length > 0) {
      const plumberToSelect = plumbers.find(p => p.id === plumberId);
      if (plumberToSelect && !selectedPlumber) {
        handleSelectPlumber(plumberToSelect);
      }
    }
  }, [plumbers, isLoading, selectedPlumber, handleSelectPlumber]);

  const addPlumber = useCallback(async (plumberData: PlumberFormData, imageFile?: File | null) => {
    let newImageUrl: string | undefined = undefined;
    if (imageFile) {
        const filePath = `public/${Date.now()}-${imageFile.name}`;
        const { error: uploadError } = await supabase.storage
            .from('plumber-images')
            .upload(filePath, imageFile);

        if (uploadError) {
            console.error('Error uploading image:', uploadError.message);
            throw uploadError;
        }

        const { data } = supabase.storage.from('plumber-images').getPublicUrl(filePath);
        newImageUrl = data.publicUrl;
    }
      
    const { data: newPlumber, error } = await supabase.from('plumbers').insert([
      { ...plumberData, imageUrl: newImageUrl, ratings: [], likes: 0, dislikes: 0 }
    ]).select().single();
      
    if (error) {
        console.error("Error submitting profile:", error.message || error);
        throw error;
    }

    if (newPlumber) {
        setPlumbers(currentPlumbers => [...currentPlumbers, { ...newPlumber, comment_count: 0 }]);
    }
  }, []);
  
  const ratePlumber = useCallback(async (id: string, rating: number) => {
      const plumberToUpdate = plumbers.find(p => p.id === id);
      if (!plumberToUpdate) {
        console.error("Plumber not found for rating");
        return;
      }

    const newRatings = [...(plumberToUpdate.ratings || []), rating];
    
    const updatedPlumbers = plumbers.map(p => p.id === id ? { ...p, ratings: newRatings } : p);
    setPlumbers(updatedPlumbers);
    if (selectedPlumber?.id === id) {
        setSelectedPlumber(current => current ? { ...current, ratings: newRatings } : null);
    }
    
    const { error } = await supabase
        .from('plumbers')
        .update({ ratings: newRatings })
        .eq('id', id);

    if (error) {
        console.error("Error rating plumber:", error.message || error);
        setPlumbers(plumbers);
        if (selectedPlumber?.id === id) {
            setSelectedPlumber(plumberToUpdate);
        }
    }
  }, [plumbers, selectedPlumber]);

  const handleVote = useCallback(async (plumberId: string, voteType: 'like' | 'dislike') => {
    if (!userIp) {
      addToast("Could not verify your identity to vote. Please try refreshing.", 'error');
      return;
    }
    
    const originalPlumbers = [...plumbers];
    const originalVotes = {...userVotes};
    const plumber = plumbers.find(p => p.id === plumberId);
    if (!plumber) return;

    const previousVote = userVotes[plumberId];
    let newLikes = plumber.likes;
    let newDislikes = plumber.dislikes;
    const newVotes = { ...userVotes };

    if (previousVote === voteType) { // Undoing vote
        if (voteType === 'like') newLikes--;
        else newDislikes--;
        delete newVotes[plumberId];
    } else if (previousVote) { // Changing vote
        if (voteType === 'like') {
            newLikes++;
            newDislikes--;
        } else {
            newLikes--;
            newDislikes++;
        }
        newVotes[plumberId] = voteType;
    } else { // New vote
        if (voteType === 'like') newLikes++;
        else newDislikes++;
        newVotes[plumberId] = voteType;
    }

    const updatedPlumbers = plumbers.map(p => 
        p.id === plumberId ? { ...p, likes: newLikes, dislikes: newDislikes } : p
    );
    setPlumbers(updatedPlumbers);
    setUserVotes(newVotes);

    const { error } = await supabase.rpc('handle_vote', {
      plumber_uuid: plumberId,
      voter_ip: userIp,
      vote_direction: voteType,
    });

    if (error) {
        console.error("Error updating vote:", error.message);
        addToast("Failed to save your vote. Please try again.", 'error');
        setPlumbers(originalPlumbers); 
        setUserVotes(originalVotes);
    }
  }, [plumbers, userVotes, userIp, addToast]);

  const renderPage = () => {
    switch (page) {
      case 'home':
        return <HomePage addPlumber={addPlumber} />;
      case 'directory':
        return <DirectoryPage plumbers={plumbers} onRate={ratePlumber} isLoading={isLoading} fetchError={fetchError} onRetry={fetchPlumbers} onPlumberSelect={handleSelectPlumber} onVote={handleVote} userVotes={userVotes} />;
      case 'plumberDetail':
        return selectedPlumber ? <PlumberDetailPage plumber={selectedPlumber} onBack={handleBackToDirectory} onRate={ratePlumber} /> : <DirectoryPage plumbers={plumbers} onRate={ratePlumber} isLoading={isLoading} fetchError={fetchError} onRetry={fetchPlumbers} onPlumberSelect={handleSelectPlumber} onVote={handleVote} userVotes={userVotes} />;
      case 'about':
        return <AboutUsPage />;
      case 'privacy':
        return <PrivacyPolicyPage />;
      case 'contact':
        return <ContactUsPage />;
      default:
        return <HomePage addPlumber={addPlumber} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header setPage={setPage} currentPage={page} />
      <ToastContainer />
      <main className="flex-grow">
        {renderPage()}
      </main>
      <Footer setPage={setPage} />
      <ScrollToTopButton />
      <GDPRBanner setPage={setPage} />
    </div>
  );
};

export default App;