// src/routes/index.tsx
import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/atoms/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/atoms/card'
import { Badge } from '@/components/atoms/badge'

export const Route = createFileRoute('/')({
    component: Home,
})

function Home() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background transition-colors duration-300 p-4">
            {/* Main Content */}
            <div className="w-full max-w-4xl space-y-6">
                <Card className="max-w-md w-full mx-auto">
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
            </div>
        </div>
    )
}