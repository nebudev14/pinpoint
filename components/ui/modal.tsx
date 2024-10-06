"use client"

import React, { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description: string
  firstname: string
  lastname: string
}

export default function Component({ isOpen, onClose, title, description, firstname, lastname }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

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

  return (
    <>
      <style jsx global>{`
        @font-face {
          font-family: 'Roboto';
          font-style: normal;
          font-weight: 300;
          font-display: swap;
          src: url(https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmSU5fBBc4.woff2) format('woff2');
        }
        @font-face {
          font-family: 'Roboto';
          font-style: normal;
          font-weight: 400;
          font-display: swap;
          src: url(https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxK.woff2) format('woff2');
        }
        @font-face {
          font-family: 'Roboto';
          font-style: normal;
          font-weight: 500;
          font-display: swap;
          src: url(https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmEU9fBBc4.woff2) format('woff2');
        }
      `}</style>
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
              style={{ fontFamily: 'Roboto, sans-serif' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative p-6 space-y-4">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 focus:outline-none focus:text-gray-800 transition ease-in-out duration-150"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
                <div className="space-y-2">
                  <h3 className="text-2xl font-medium text-gray-900 leading-tight" id="modal-title">
                    {title}
                  </h3>
                  <p className="text-base text-gray-700 leading-relaxed">
                    {description}
                  </p>
                </div>
                <div className="pt-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Created By:</span>{' '}
                    <span className="text-gray-800">{firstname} {lastname}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}