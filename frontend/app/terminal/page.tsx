"use client";

import React from "react";
import { TerminalLayout } from "@/components/terminal/layout";

export default function TerminalPage(): React.ReactElement {
	return (
		<div className="h-screen w-full">
			<TerminalLayout />
		</div>
	);
}
