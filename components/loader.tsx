"use client"

import { useState, useEffect } from "react"
import { Brain, Activity, CheckCircle } from "lucide-react"

type LoaderState = "initialising" | "finding" | "initiased" | "idle"

interface AILoaderProps {
  state?: LoaderState
  message?: string
  isVisible?: boolean
  onComplete?: () => void
  autoProgress?: boolean
  autoProgressDuration?: number
}

export default function AILoader({
  state = "idle",
  message,
  isVisible = false,
}: AILoaderProps) {
  const [currentState, setCurrentState] = useState<LoaderState>(state)
  const [customMessage, setCustomMessage] = useState<string | undefined>(message)

  console.log({ state })
  useEffect(() => {
    setCurrentState(state)
  }, [state])

  useEffect(() => {
    setCustomMessage(message)
  }, [message])


  if (!isVisible) return null

  const getStateMessage = () => {
    if (customMessage) return customMessage

    switch (currentState) {
      case "finding":
        return "Trying to find local model..."
      case "initialising":
        return "Initialising Model..."
      case "initiased":
        return "Initialisation complete!"
      default:
        return ""
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div className="bg-background rounded-lg shadow-lg p-6 max-w-md w-full mx-4 flex flex-col items-center">
        <div className="flex items-center justify-center space-x-4 mb-4">
          <div
            className={`transition-opacity duration-500 ${currentState === "finding" ? "opacity-100" : "opacity-30"}`}
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Brain
                className={`w-8 h-8 ${currentState === "finding" ? "text-primary animate-pulse" : "text-muted-foreground"}`}
              />
            </div>
            <p className="text-xs text-center mt-2 uppercase">finding</p>
          </div>

          <div className="w-8 h-0.5 bg-muted" />

          <div
            className={`transition-opacity duration-500 ${currentState === "initialising" ? "opacity-100" : "opacity-30"}`}
          >
            <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center">
              <Activity
                className={`w-8 h-8 ${currentState === "initialising" ? "text-amber-500 animate-pulse" : "text-muted-foreground"}`}
              />
            </div>
            <p className="text-xs text-center mt-2 uppercase">initialising</p>
          </div>

          <div className="w-8 h-0.5 bg-muted" />

          <div
            className={`transition-opacity duration-500 ${currentState === "initiased" ? "opacity-100" : "opacity-30"}`}
          >
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle
                className={`w-8 h-8 ${currentState === "initiased" ? "text-green-500" : "text-muted-foreground"}`}
              />
            </div>
            <p className="text-xs text-center mt-2 uppercase">initiased</p>
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-lg font-medium">{getStateMessage()}</p>

          <div className="mt-6 flex justify-center">
            {currentState !== "initiased" && (
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

