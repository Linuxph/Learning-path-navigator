import { useState, useEffect } from "react"
import {
  Moon,
  Sun,
  Menu,
  X,
  Star,
  Users,
  BookOpen,
  Target,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Play,
  Zap,
  Globe,
} from "lucide-react"

// Button Component
function Button({ children, className = "", variant = "default", size = "default", onClick, ...props }) {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background"

  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    outline: "border border-input hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  }

  const sizes = {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3 rounded-md",
    lg: "h-11 px-8 rounded-md",
    icon: "h-10 w-10",
  }

  return (
    <button className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`} onClick={onClick} {...props}>
      {children}
    </button>
  )
}

// Card Components
function Card({ children, className = "", ...props }) {
  return (
    <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`} {...props}>
      {children}
    </div>
  )
}

function CardHeader({ children, className = "", ...props }) {
  return (
    <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props}>
      {children}
    </div>
  )
}

function CardTitle({ children, className = "", ...props }) {
  return (
    <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`} {...props}>
      {children}
    </h3>
  )
}

function CardDescription({ children, className = "", ...props }) {
  return (
    <p className={`text-sm text-muted-foreground ${className}`} {...props}>
      {children}
    </p>
  )
}

function CardContent({ children, className = "", ...props }) {
  return (
    <div className={`p-6 pt-0 ${className}`} {...props}>
      {children}
    </div>
  )
}

// Badge Component
function Badge({ children, className = "", variant = "default", ...props }) {
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/80",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/80",
    outline: "text-foreground border border-input",
  }

  return (
    <div
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export default function DevPathLanding() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDarkMode(true)
      document.documentElement.classList.add("dark")
    }
  }, [])

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    if (isDarkMode) {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    } else {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    }
  }

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" })
    setIsMobileMenuOpen(false)
  }

  const handleClick = () => {
    window.location.href = "/auth"
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-500">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">DevPath</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection("features")}
                className="text-sm font-medium hover:text-pink-500 transition-colors"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("testimonials")}
                className="text-sm font-medium hover:text-pink-500 transition-colors"
              >
                Testimonials
              </button>
              <button
                onClick={() => scrollToSection("pricing")}
                className="text-sm font-medium hover:text-pink-500 transition-colors"
              >
                Pricing
              </button>
            </nav>

            <div className="flex items-center space-x-4">
              {/* <Button variant="ghost" size="icon" onClick={toggleTheme} className="hover:bg-muted transition-colors">
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button> */}

              <Button onClick={handleClick} className="hidden md:inline-flex bg-pink-500 hover:bg-pink-600 text-white transition-all duration-200 hover:scale-105">
                Get Started Free
              </Button>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t bg-background/95 backdrop-blur">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <button
                  onClick={() => scrollToSection("features")}
                  className="block px-3 py-2 text-base font-medium hover:text-pink-500 transition-colors"
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection("testimonials")}
                  className="block px-3 py-2 text-base font-medium hover:text-pink-500 transition-colors"
                >
                  Testimonials
                </button>
                <button
                  onClick={() => scrollToSection("pricing")}
                  className="block px-3 py-2 text-base font-medium hover:text-pink-500 transition-colors"
                >
                  Pricing
                </button>
                <Button className="w-full mt-2 bg-pink-500 hover:bg-pink-600 text-white">Get Started Free</Button>
              </div>
            </div>
          )}
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 sm:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <div className="animate-fade-in-up">
                <Badge
                  variant="secondary"
                  className="mb-6 px-4 py-2 text-sm font-medium bg-pink-50 text-white dark:bg-pink-900 dark:text-pink-300 border-pink-200 dark:border-pink-800"
                >
                  Your Learning Journey Starts Here
                </Badge>

                <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-6xl lg:text-7xl mb-6">
                  Master Any Skill with{" "}
                  <span className="text-pink-500 relative">
                    Personalized
                    <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-pink-400 to-pink-600 rounded-full transform scale-x-0 animate-scale-x"></div>
                  </span>{" "}
                  Learning Paths
                </h1>

                <p className="mx-auto max-w-2xl text-lg text-muted-foreground text-pretty mb-8">
                  Transform your learning experience with AI-powered personalized paths, progress tracking, and adaptive
                  content that grows with you.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                  <Button
                    onClick={handleClick}
                    size="lg"
                    className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 text-lg font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg"
                  >
                    Start Learning Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  {/* <Button
                    size="lg"
                    variant="outline"
                    className="px-8 py-3 text-lg font-semibold border-2 hover:bg-muted transition-all duration-200 bg-transparent"
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Watch Demo
                  </Button> */}
                </div>

                {/* Progress Visualization */}
                <div className="mx-auto max-w-md space-y-4 animate-fade-in-up animation-delay-300">
                  <div className="text-left">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Digital Marketing</span>
                      <span className="text-sm text-muted-foreground">85%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-pink-500 h-2 rounded-full transition-all duration-1000 ease-out animate-progress-85"></div>
                    </div>
                  </div>

                  <div className="text-left">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Data Analysis</span>
                      <span className="text-sm text-muted-foreground">67%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full transition-all duration-1000 ease-out animate-progress-67"></div>
                    </div>
                  </div>

                  <div className="text-left">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Creative Writing</span>
                      <span className="text-sm text-muted-foreground">42%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full transition-all duration-1000 ease-out animate-progress-42"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                Everything You Need to Learn Effectively
              </h2>
              <p className="text-lg text-muted-foreground text-pretty">
                Our platform adapts to your learning style and pace, ensuring you achieve your goals efficiently.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 bg-background">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto w-12 h-12 bg-pink-100 dark:bg-pink-900/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Target className="h-6 w-6 text-pink-500" />
                  </div>
                  <CardTitle className="text-xl">Personalized Paths</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-base">
                    AI-powered learning paths tailored to your goals, skill level, and preferred learning style.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 bg-background">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="h-6 w-6 text-blue-500" />
                  </div>
                  <CardTitle className="text-xl">Progress Tracking</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-base">
                    Visual progress tracking with detailed analytics to keep you motivated and on track.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 bg-background">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Zap className="h-6 w-6 text-green-500" />
                  </div>
                  <CardTitle className="text-xl">Adaptive Learning</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-base">
                    Content that adapts to your pace and understanding, ensuring optimal learning efficiency.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 bg-background">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Globe className="h-6 w-6 text-purple-500" />
                  </div>
                  <CardTitle className="text-xl">Global Community</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-base">
                    Connect with learners worldwide, share progress, and learn from diverse perspectives.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">What Our Learners Say</h2>
              <p className="text-lg text-muted-foreground text-pretty">
                Join thousands of learners who have transformed their skills with DevPath.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="text-base mb-4">
                    "DevPath completely changed how I approach learning. The personalized paths helped me master digital
                    marketing in just 3 months!"
                  </blockquote>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                      S
                    </div>
                    <div>
                      <div className="font-semibold">Sarah Chen</div>
                      <div className="text-sm text-muted-foreground">Marketing Specialist</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="text-base mb-4">
                    "The progress tracking keeps me motivated every day. I can see exactly how far I've come and what's
                    next on my learning journey."
                  </blockquote>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                      M
                    </div>
                    <div>
                      <div className="font-semibold">Marcus Johnson</div>
                      <div className="text-sm text-muted-foreground">Data Analyst</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="text-base mb-4">
                    "As someone who learns differently, the adaptive content feature has been a game-changer. Finally, a
                    platform that gets me!"
                  </blockquote>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                      A
                    </div>
                    <div>
                      <div className="font-semibold">Aisha Patel</div>
                      <div className="text-sm text-muted-foreground">Creative Writer</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Start Your Learning Journey Today</h2>
              <p className="text-lg text-muted-foreground text-pretty">
                Begin with our free plan and upgrade as you grow. No hidden fees, cancel anytime.
              </p>
            </div>

            <div className="mx-auto max-w-md">
              <Card className="relative hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 border-pink-200 dark:border-pink-800">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-pink-500 text-white px-4 py-1 text-sm font-semibold">🎉 Launch Special</Badge>
                </div>
                <CardHeader className="text-center pb-8 pt-8">
                  <CardTitle className="text-2xl font-bold">Free Forever</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">$0</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <CardDescription className="text-base mt-2">
                    Perfect for getting started with personalized learning
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span>3 personalized learning paths</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span>Basic progress tracking</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span>Community access</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span>Mobile app access</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span>Email support</span>
                    </div>
                  </div>
                  <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white mt-8 py-3 text-lg font-semibold transition-all duration-200 hover:scale-105">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <p className="text-xs text-center text-muted-foreground mt-4">
                    More plans coming soon! We're expanding our offerings based on your feedback.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 bg-gradient-to-r from-pink-500 to-pink-600 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 text-balance">
                Ready to Transform Your Learning?
              </h2>
              <p className="text-xl text-pink-100 text-pretty mb-8">
                Join our growing community of learners and start your personalized learning journey today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-white text-pink-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold transition-all duration-200 hover:scale-105"
                >
                  Start Learning Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-pink-600 px-8 py-3 text-lg font-semibold transition-all duration-200 bg-transparent"
                >
                  <Users className="mr-2 h-5 w-5" />
                  Join Community
                </Button>
              </div>
              <p className="text-sm text-pink-200 mt-6">
                No credit card required • Free forever • Join 1,000+ early learners
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-background border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-500">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">DevPath</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Empowering learners worldwide with personalized learning paths and adaptive content.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-pink-500 transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-pink-500 transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-pink-500 transition-colors">
                    Learning Paths
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-pink-500 transition-colors">
                    Mobile App
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-pink-500 transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-pink-500 transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-pink-500 transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-pink-500 transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-pink-500 transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-pink-500 transition-colors">
                    Community
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-pink-500 transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-pink-500 transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">© 2025 DevPath. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 sm:mt-0">
              <a href="#" className="text-muted-foreground hover:text-pink-500 transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-pink-500 transition-colors">
                <span className="sr-only">GitHub</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-pink-500 transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scale-x {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }

        @keyframes progress-85 {
          from {
            width: 0%;
          }
          to {
            width: 85%;
          }
        }

        @keyframes progress-67 {
          from {
            width: 0%;
          }
          to {
            width: 67%;
          }
        }

        @keyframes progress-42 {
          from {
            width: 0%;
          }
          to {
            width: 42%;
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }

        .animation-delay-300 {
          animation-delay: 300ms;
        }

        .animate-scale-x {
          animation: scale-x 0.8s ease-out 0.5s both;
        }

        .animate-progress-85 {
          animation: progress-85 2s ease-out 1s both;
        }

        .animate-progress-67 {
          animation: progress-67 2s ease-out 1.2s both;
        }

        .animate-progress-42 {
          animation: progress-42 2s ease-out 1.4s both;
        }
      `}</style>
    </div>
  )
}
