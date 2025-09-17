"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

export function AgentPanel(): React.ReactElement {
	return (
		<Card variant="glass" className="h-full">
			<CardHeader className="pb-3">
				<CardTitle className="text-sm flex items-center gap-2">
					<MessageSquare className="w-4 h-4" />
					Agent Console
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-3">
				<div className="text-xs text-muted-foreground">
					Your AI agent can summarize the market, draft strategies, and execute playbooks.
				</div>
				<div className="grid grid-cols-2 gap-2">
					<Button variant="outline" size="sm" className="justify-start">
						Market Summary
					</Button>
					<Button variant="outline" size="sm" className="justify-start">
						Screen Opportunities
					</Button>
					<Button variant="outline" size="sm" className="justify-start">
						Risk Report
					</Button>
					<Button variant="outline" size="sm" className="justify-start">
						Create Plan
					</Button>
				</div>
				<div className="flex items-center gap-2 pt-2 border-t">
					<Badge variant="secondary" className="text-xs">Connected</Badge>
					<span className="text-xs text-muted-foreground">Gemini runtime</span>
				</div>
			</CardContent>
		</Card>
	);
}
