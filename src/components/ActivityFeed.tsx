import { ScrollArea } from "@/components/ui/scroll-area"
import { createClient } from "@/utils/supabase/server"
import { formatDistanceToNow } from "date-fns"
import { Activity, CheckCircle2, UserPlus, FileText } from "lucide-react"

export async function ActivityFeed() {
  const supabase = await createClient()
  const { data: logs } = await supabase
    .from('activity_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(15)

  const getIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'created': return <UserPlus className="h-4 w-4" />;
      case 'completed': return <CheckCircle2 className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  }

  return (
    <div className="space-y-4">
      <ScrollArea className="h-[350px] pr-4">
        {logs?.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No recent activity.</p>
        ) : (
          <div className="space-y-6">
            {logs?.map((log) => (
              <div key={log.id} className="flex items-start gap-4 text-sm relative">
                <div className="absolute left-3.5 top-8 bottom-[-24px] w-px bg-border/50 last:hidden" />
                <div className="relative z-10 bg-background border p-1.5 rounded-full text-primary shadow-sm">
                  {getIcon(log.action)}
                </div>
                <div className="flex-1 space-y-1.5 pt-1">
                  <p className="font-medium leading-none text-foreground capitalize">
                    {log.action} <span className="font-normal text-muted-foreground">{log.entity}</span>
                  </p>
                  {log.details && (
                    <p className="text-muted-foreground text-xs bg-muted/30 p-2 rounded-md border">{log.details}</p>
                  )}
                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                    {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
