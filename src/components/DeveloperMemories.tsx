import React, { useState } from 'react';
import { MessageSquare, Heart, Send, Sparkles, Tag, User } from 'lucide-react';
import { INITIAL_MEMORIES } from '../data/mockData';
import { DeveloperMemory } from '../types';

export const DeveloperMemories: React.FC = () => {
  const [memories, setMemories] = useState<DeveloperMemory[]>(INITIAL_MEMORIES);
  const [newQuote, setNewQuote] = useState<string>('');
  const [authorName, setAuthorName] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<'All' | 'Meme' | 'Relatable' | 'Fix' | '2 AM'>('All');

  const handlePostMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuote.trim()) return;

    const newMem: DeveloperMemory = {
      id: `mem-${Date.now()}`,
      author: authorName.trim() || 'Anonymous Coder',
      handle: `@${(authorName.trim() || 'night_owl').toLowerCase().replace(/\s+/g, '_')}`,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      timestamp: 'Just now',
      quote: newQuote.trim(),
      likes: 1,
      isLiked: true,
      tag: '2 AM'
    };

    setMemories([newMem, ...memories]);
    setNewQuote('');
  };

  const toggleLike = (id: string) => {
    setMemories((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const isLiked = !m.isLiked;
          return {
            ...m,
            isLiked,
            likes: m.likes + (isLiked ? 1 : -1)
          };
        }
        return m;
      })
    );
  };

  const filteredMemories = selectedTag === 'All'
    ? memories
    : memories.filter((m) => m.tag === selectedTag);

  return (
    <section className="w-full space-y-6">
      
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-400/30 text-pink-300 font-mono text-xs font-bold mb-1">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>COMMUNITY MEMORY CAPSULE</span>
          </div>
          <h3 className="font-display font-bold text-2xl sm:text-3xl text-white">
            2 AM Developer Thoughts & Stories
          </h3>
        </div>

        {/* Filter Tags */}
        <div className="flex items-center space-x-1 p-1 bg-white/5 rounded-2xl border border-white/10 font-mono text-xs">
          {(['All', 'Relatable', 'Fix', '2 AM'] as const).map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                selectedTag === tag ? 'bg-pink-500 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Grid: Submit Box + Memory Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Post Form (4 Cols) */}
        <div className="lg:col-span-4 glass-panel rounded-3xl p-6 border border-white/15 h-fit space-y-4">
          <h4 className="font-display font-bold text-lg text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span>Share Your 2 AM Story</span>
          </h4>

          <form onSubmit={handlePostMemory} className="space-y-3 font-mono text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Your Name / Handle</label>
              <div className="relative">
                <User className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
                <input
                  type="text"
                  placeholder="e.g. CodeNinja"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full bg-[#080c16] border border-white/10 rounded-xl pl-8 pr-3 py-2 text-slate-200 focus:outline-none focus:border-pink-400"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Late Night Thought / Bug Story</label>
              <textarea
                rows={3}
                placeholder="What kept you awake at 2 AM tonight?"
                value={newQuote}
                onChange={(e) => setNewQuote(e.target.value)}
                className="w-full bg-[#080c16] border border-white/10 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-pink-400 resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={!newQuote.trim()}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white font-bold flex items-center justify-center space-x-2 shadow-neon-pink transition-all active:scale-95 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Post to Capsule</span>
            </button>
          </form>
        </div>

        {/* Memory Cards (8 Cols) */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMemories.map((mem) => (
            <div
              key={mem.id}
              className="glass-panel glass-panel-hover rounded-2xl p-5 border border-white/10 flex flex-col justify-between space-y-4"
            >
              <blockquote className="font-mono text-xs text-slate-200 leading-relaxed italic">
                "{mem.quote}"
              </blockquote>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between font-mono text-xs">
                <div className="flex items-center space-x-2">
                  <img src={mem.avatar} alt={mem.author} className="w-7 h-7 rounded-full object-cover border border-white/20" />
                  <div>
                    <p className="font-bold text-white">{mem.author}</p>
                    <p className="text-[10px] text-slate-500">{mem.timestamp}</p>
                  </div>
                </div>

                <button
                  onClick={() => toggleLike(mem.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1 rounded-xl transition-all ${
                    mem.isLiked
                      ? 'bg-pink-500/20 text-pink-400 border border-pink-500/40'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${mem.isLiked ? 'fill-pink-400' : ''}`} />
                  <span>{mem.likes}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

    </section>
  );
};
