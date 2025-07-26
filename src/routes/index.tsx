// src/routes/index.tsx
import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Button } from '@/components/atoms/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/atoms/card'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/atoms/tooltip'
import { Badge } from '@/components/atoms/badge'
import { Moon, Sun } from 'lucide-react'

export const Route = createFileRoute('/')({
    component: Home,
})

function Home() {
    const [isDark, setIsDark] = useState(false)

    useEffect(() => {
        // Check for saved theme preference or default to light
        const savedTheme = localStorage.getItem('theme')
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            setIsDark(true)
            document.documentElement.classList.add('dark')
        }
    }, [])

    const toggleTheme = () => {
        const newTheme = !isDark
        setIsDark(newTheme)

        if (newTheme) {
            document.documentElement.classList.add('dark')
            localStorage.setItem('theme', 'dark')
        } else {
            document.documentElement.classList.remove('dark')
            localStorage.setItem('theme', 'light')
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background transition-colors duration-300">
            {/* Main Content */}
            <Card className="max-w-md w-full mx-4">
                <CardHeader className="text-center">
                    <CardTitle className="text-4xl font-bold text-primary mb-2">
                        Welcome to KotobaMichi
                    </CardTitle>
                    <Badge variant="outline" className="mx-auto mb-2">
                        言葉道
                    </Badge>
                </CardHeader>
                <CardContent className="text-center space-y-6">
                    <CardDescription className="leading-relaxed text-base">
                        KotobaMichi(言葉道) is your go-to platform for language exchange and
                        cultural交流. Connect with native speakers, practice your skills,
                        and explore new languages together!
                    </CardDescription>
                    <div className="space-y-3">
                        <Button
                            size="lg"
                            className="w-full font-semibold"
                        >
                            Get Started
                        </Button>
                        <Button
                            variant="secondary"
                            size="lg"
                            className="w-full font-semibold"
                        >
                            Learn More
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Floating Dark Mode Toggle */}
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={toggleTheme}
                        className="fixed bottom-6 right-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 z-50"
                        aria-label="Toggle dark mode"
                    >
                        {isDark ? (
                            <Sun className="h-5 w-5" />
                        ) : (
                            <Moon className="h-5 w-5" />
                        )}
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    {isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                </TooltipContent>
            </Tooltip>
        </div>
    )
}