import * as React from "react"

interface Team {
  name: string
  logo: React.ComponentType<{ className?: string }>
  plan: string
}

interface TeamSwitcherProps {
  teams: Team[]
}

export function TeamSwitcher({ teams }: TeamSwitcherProps) {
  const selectedTeam = teams[0]

  return (
    <div className="w-full h-auto p-3">
      <div className="flex items-center gap-3">
        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <selectedTeam.logo className="size-4" />
        </div>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-semibold text-foreground">{selectedTeam.name}</span>
          <span className="truncate text-xs text-muted-foreground">{selectedTeam.plan}</span>
        </div>
      </div>
    </div>
  )
}
