"use client"

import React, { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Users, Calendar, BookOpen, ArrowRight, Map } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface StepCompletionProps {
  firstName: string;
  challengeStartDate: Date | null;
  challengeDuration: number;
  firstLessonTitle: string | null;
  firstLessonModuleTitle: string | null;
  communityLink: string;
  founderMessage: string;
  milestones: Array<{ title: string; icon: string | null; phase: string }>;
  onComplete: () => void;
}

export function StepCompletion({
  firstName,
  challengeStartDate,
  challengeDuration,
  firstLessonTitle,
  firstLessonModuleTitle,
  communityLink,
  founderMessage,
  milestones, // Passed in but we are using the hardcoded 6 phases for the roadmap as requested
  onComplete,
}: StepCompletionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  // Confetti Animation Logic
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    
    const particles: any[] = []
    const colors = ["#FFD700", "#9333EA", "#06B6D4"] // Gold, Purple, Cyan
    
    // Create particles
    for (let i = 0; i < 150; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2 + 100, // start slightly lower center
        r: Math.random() * 6 + 2,
        dx: Math.random() * 10 - 5,
        dy: Math.random() * -15 - 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.floor(Math.random() * 10) - 10,
        tiltAngle: 0,
        tiltAngleInc: (Math.random() * 0.07) + 0.05
      })
    }
    
    let animationFrame: number
    const startTime = Date.now()
    
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      const elapsedTime = Date.now() - startTime
      
      let allFell = true
      
      particles.forEach((p) => {
        if (elapsedTime < 3000) {
           allFell = false
        }
        
        p.tiltAngle += p.tiltAngleInc
        p.y += (Math.cos(p.tiltAngle) + 1 + p.r / 2) / 2
        p.x += Math.sin(p.tiltAngle) * 2
        
        // Gravity / fall effect
        p.dy += 0.1 // gravity
        p.y += p.dy
        p.x += p.dx
        
        if (p.y < canvas.height || p.x > 0 || p.x < canvas.width) {
             allFell = false
        }

        ctx.beginPath()
        ctx.lineWidth = p.r
        ctx.strokeStyle = p.color
        ctx.moveTo(p.x + p.tilt + p.r, p.y)
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r)
        ctx.stroke()
      })
      
      if (!allFell) {
        animationFrame = requestAnimationFrame(render)
      }
    }
    
    render()
    
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener("resize", handleResize)
    
    return () => {
      cancelAnimationFrame(animationFrame)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const containerVariants: import("framer-motion").Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants: import("framer-motion").Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  }
  
  const formatDate = (date: Date | null) => {
      if (!date) return "Ready when you are"
      return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(date)
  }

  const roadmapPhases = [
    'Learn AI', 
    'Build Skills', 
    'Build Your Offer', 
    'Build Your Portfolio', 
    'Get Your First Client', 
    'Scale Your Business'
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#09090B] text-foreground flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-50 h-full w-full"
      />
      
      <div className="z-10 w-full max-w-4xl mx-auto space-y-12">
        {/* Header section */}
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center space-y-4"
        >
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                <span className="text-zinc-400">Welcome to </span>
                <br className="md:hidden" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-cyan-400 to-amber-400 animate-pulse">
                    The Ecosystem
                </span>
                <span className="text-zinc-400">, {firstName}</span>
            </h1>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
                Your Welcome Package is ready. Everything you need for The Eensell Journey is right here.
            </p>
        </motion.div>

        {/* Welcome Package Grid */}
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
            {/* 1. Your Roadmap */}
            <motion.div variants={itemVariants}>
                <Card className="bg-[#18181B] border-[#27272A] h-full hover:border-purple-500/50 transition-colors duration-300">
                    <CardContent className="p-6 flex flex-col h-full justify-between">
                        <div>
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="p-2 rounded-lg bg-purple-500/10">
                                    <Map className="w-6 h-6 text-purple-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-zinc-100">Your Roadmap</h3>
                            </div>
                            <p className="text-sm text-zinc-400 mb-6">60 days to transform your life</p>
                        </div>
                        
                        <div className="space-y-3 mt-auto">
                            {roadmapPhases.map((phase, idx) => (
                                <div key={idx} className="flex items-center space-x-3">
                                    <div className="w-2 h-2 rounded-full bg-cyan-400/70 shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                                    <span className="text-sm text-zinc-300">{phase}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* 2. The Community & 3. Challenge Start & 4. First Mission */}
            <div className="flex flex-col gap-6">
                <motion.div variants={itemVariants}>
                    <Card 
                        className="bg-[#18181B] border-[#27272A] hover:border-cyan-500/50 transition-colors duration-300 group cursor-pointer" 
                        onClick={() => window.open(communityLink, '_blank')}
                    >
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 rounded-lg bg-cyan-500/10">
                                        <Users className="w-6 h-6 text-cyan-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-zinc-100">The Community</h3>
                                        <p className="text-sm text-zinc-400">Join your peers</p>
                                    </div>
                                </div>
                                <ArrowRight className="w-5 h-5 text-zinc-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Card className="bg-[#18181B] border-[#27272A] hover:border-amber-500/50 transition-colors duration-300">
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-3 mb-2">
                                <div className="p-2 rounded-lg bg-amber-500/10">
                                    <Calendar className="w-6 h-6 text-amber-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-zinc-100">Challenge Start</h3>
                            </div>
                            <div className="ml-11">
                                <p className="text-zinc-200 font-medium">{formatDate(challengeStartDate)}</p>
                                <p className="text-sm text-zinc-500 mt-1">Day 1 of {challengeDuration}</p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
                
                <motion.div variants={itemVariants} className="flex-1">
                    <Card className="bg-[#18181B] border-[#27272A] h-full hover:border-emerald-500/50 transition-colors duration-300">
                        <CardContent className="p-6 h-full flex flex-col justify-center">
                            <div className="flex items-center space-x-3 mb-2">
                                <div className="p-2 rounded-lg bg-emerald-500/10">
                                    <BookOpen className="w-6 h-6 text-emerald-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-zinc-100">First Mission</h3>
                            </div>
                            <div className="ml-11">
                                <p className="text-sm text-emerald-400/80 mb-1">{firstLessonModuleTitle || "Module 1"}</p>
                                <p className="text-zinc-200 font-medium line-clamp-2">
                                    {firstLessonTitle || "Your introduction to the journey"}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* 5. Founder's Note */}
            <motion.div variants={itemVariants} className="md:col-span-2">
                <Card className="bg-gradient-to-br from-[#18181B] to-[#121214] border-[#27272A] relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-32 bg-purple-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <CardContent className="p-8 md:p-12">
                        <h3 className="text-sm font-semibold tracking-widest text-zinc-500 uppercase mb-6">A Note from the Founder</h3>
                        <p className="text-2xl md:text-3xl font-handwritten text-zinc-200 leading-relaxed tracking-wide">
                            "{founderMessage}"
                        </p>
                    </CardContent>
                </Card>
            </motion.div>

        </motion.div>

        {/* Enter Dashboard Button */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="flex justify-center mt-12 pb-12"
        >
            <div className="relative group rounded-full">
                {/* Animated gradient border glow */}
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-purple-600 via-cyan-600 to-amber-600 opacity-70 blur group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                
                <Button 
                    onClick={onComplete}
                    className="relative bg-[#09090B] text-zinc-100 hover:bg-[#18181B] hover:text-white border border-zinc-800 text-lg md:text-xl py-8 px-12 rounded-full font-semibold transition-all duration-300 flex items-center space-x-3 group"
                >
                    <span>Enter the Dashboard</span>
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </Button>
            </div>
        </motion.div>
      </div>
    </div>
  )
}
