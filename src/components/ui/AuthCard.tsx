import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./Card"

interface AuthCardProps {
  title: string
  description?: React.ReactNode
  children: React.ReactNode
}

const AuthCard: React.FC<AuthCardProps> = ({
  title,
  description,
  children
}) => {
  return (
    <Card className="w-full max-w-md mx-auto bg-black border-zinc-800">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center text-zinc-100">
          {title}
        </CardTitle>
        {description && (
          <CardDescription className="text-center text-zinc-400">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  )
}

export { AuthCard }