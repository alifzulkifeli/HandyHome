'use client'

import { useState, useEffect } from 'react'
import { Share2, PlusCircle, Menu } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function InstallGuide() {
  const [isIOS, setIsIOS] = useState(false)
  const [isAndroid, setIsAndroid] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream)
    setIsAndroid(/Android/.test(navigator.userAgent))
    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches)
  }, [])

  if (isStandalone) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>App Installed</CardTitle>
            <CardDescription>You&apos;re already using the installed app!</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Great job! You&apos;ve successfully installed our PWA. Enjoy the app experience!</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Install Our App</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Why Install?</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2">
            <li>Faster access to our app</li>
            <li>Works offline or with poor connections</li>
            <li>Regular updates without manual downloads</li>
            <li>Saves storage space compared to traditional apps</li>
          </ul>
        </CardContent>
      </Card>
      {isIOS && <IOSInstructions />}
      {isAndroid && <AndroidInstructions />}
      {!isIOS && !isAndroid && <DesktopInstructions />}
    </div>
  )
}

function IOSInstructions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Install on iOS</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Share2 className="h-6 w-6" />
          <p>1. Tap the Share button in Safari</p>
        </div>
        <div className="flex items-center space-x-2">
          <PlusCircle className="h-6 w-6" />
          <p>2. Select &quot;Add to Home Screen&quot;</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button>Add</Button>
          <p>3. Tap &quot;Add&quot; in the top right corner</p>
        </div>
      </CardContent>
    </Card>
  )
}

function AndroidInstructions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Install on Android</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Menu className="h-6 w-6" />
          <p>1. Tap the menu icon in Chrome</p>
        </div>
        <div className="flex items-center space-x-2">
          <PlusCircle className="h-6 w-6" />
          <p>2. Select &quot;Add to Home screen&quot;</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button>Add</Button>
          <p>3. Tap &quot;Add&quot; in the popup</p>
        </div>
      </CardContent>
    </Card>
  )
}

function DesktopInstructions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Install on Desktop</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>Look for the install icon in your browser&apos;s address bar:</p>
        <div className="flex items-center space-x-2">
          <PlusCircle className="h-6 w-6" />
          <p>Click the icon and follow the prompts to install</p>
        </div>
        <p>Note: If you don&apos;t see the install icon, the app may not be installable on your current browser.</p>
      </CardContent>
    </Card>
  )
}

