"use client"

import React, { useEffect, useRef, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { X, ThumbsUp, ThumbsDown, MessageSquare, Share2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUser } from "@clerk/nextjs"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description: string
  firstname: string
  lastname: string
  like_count: number
  pin_id: number,
  event_name: string,
  event_desc: string,
}

export default function Component({ isOpen, onClose, title, description, firstname, lastname, like_count, pin_id, event_name, event_desc }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const { user } = useUser()
  const [likes, setLikes] = useState(like_count)
  const [voted, setVoted] = useState<'up' | 'down' | null>(null)


  console.log(user)
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'visible'
    }
  }, [isOpen, onClose])

  const handleVote = async (voteType: 'up' | 'down') => {
    if (voted === voteType) {
      // Deselect the current vote
      setVoted(null)
      setLikes(like_count)
      console.log("down")
      const { data, error } = await supabase.from("likes").delete().eq("user_id", user?.id).eq("pin_id", pin_id)
      console.log(data, error)
    } else {
      // Change vote or vote for the first time
      setVoted(voteType)
      setLikes(prevLikes => voteType === 'up' ? like_count + 1 : like_count - 1)
      console.log({
        user_id: user?.id,
        pin_id,
        vote_type: voteType === 'up' ? 1 : 0,
        event_name: event_name,
        event_desc: event_desc,
      })
      const { data, error } = await supabase.from("likes").insert({
        user_id: user?.id,
        pin_id,
        vote_type: voteType === 'up' ? 1 : 0,
        event_name: event_name,
        event_desc: event_desc,
      })
      console.log(data, error)
    }

    // Here you would typically update the vote in your database
    // For example:
    // await supabase.from('votes').upsert({ user_id: user?.id, pin_id, vote_type: voteType })
  }

  const handleComment = () => {
    // Implement comment functionality
    console.log('Comment clicked')
  }

  const handleShare = () => {
    // Implement share functionality
    console.log('Share clicked')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex justify-center items-end bg-black bg-opacity-50 p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          onClick={onClose}
        >
          <motion.div
            ref={modalRef}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-lg bg-white shadow-2xl rounded-t-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative p-6 space-y-4">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition ease-in-out duration-150"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-gray-900 leading-tight" id="modal-title">
                  {title}
                </h3>
                <p className="text-base text-gray-600 leading-relaxed">
                  {description}
                </p>
              </div>
              <div className="pt-2">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Created By:</span>{' '}
                  <span className="text-gray-900">{firstname} {lastname}</span>
                </p>
              </div>
              <div className="flex items-center justify-between pt-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleVote('up')}
                    className={`p-2 rounded-full ${voted === 'up' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
                    aria-label="Upvote"
                  >
                    <ThumbsUp className="h-5 w-5" />
                  </button>
                  <span className="font-semibold text-lg" aria-live="polite">{likes}</span>
                  <button
                    onClick={() => handleVote('down')}
                    className={`p-2 rounded-full ${voted === 'down' ? 'bg-red-100 text-red-600' : 'hover:bg-gray-100'}`}
                    aria-label="Downvote"
                  >
                    <ThumbsDown className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex items-center space-x-4">
                  <button onClick={handleComment} className="p-2 rounded-full hover:bg-gray-100" aria-label="Comment">
                    <MessageSquare className="h-5 w-5" />
                  </button>
                  <button onClick={handleShare} className="p-2 rounded-full hover:bg-gray-100" aria-label="Share">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}