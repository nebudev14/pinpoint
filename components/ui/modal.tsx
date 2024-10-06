"use client"

import React, { useEffect, useRef, useState } from 'react'
import { createClient } from '@supabase/supabase-js';
import { X, ThumbsUp, ThumbsDown, MessageSquare, Share2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUser } from "@clerk/nextjs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description: string
  firstname: string
  lastname: string,
  like_count: number,
  pin_id: number
}

export default function Component({ isOpen, onClose, title, description, firstname, lastname, like_count, pin_id }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const { user } = useUser();
  const [likes, setLikes] = useState(like_count);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  useEffect(() => {
    // setLiked(

    // )
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


  const handleUpvote = async () => {
    setLikes((prevLikes) => prevLikes + 1);
    console.log("LIKED, TOTAL LIKES " + likes)
    const { data: liked, error: likeError } = await supabase
      .from('likes')
      .select('pin_id', { count: 'exact' })  // 'exact' gives the actual count
      .eq('pin_id', pin_id);

    if (likeError) {
      console.error(likeError);
    }
  };

  const handleDownvote = async () => {
    try {
      // Remove the like from the database
      const { data, error } = await supabase
        .from('likes')
        .delete()
        .match({ user_id: user?.id, pin_id: pin_id });

      if (error) {
        console.error('Error downvoting', error);
      } else {
        // Decrease the local like count by 1
        setLikes((prevLikes) => Math.max(prevLikes - 1, 0));
      }
    } catch (error) {
      console.error('Error downvoting', error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-x-0 bottom-0 z-50 flex justify-center items-end p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
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
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
