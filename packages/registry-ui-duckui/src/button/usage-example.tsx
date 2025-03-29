"use client";

import * as React from "react";
import { Tooltip } from "../tooltip";
import { Button } from "./button"; // Assuming there's a Button component

export function TooltipExample() {
  return (
    <div className="flex flex-col gap-8 p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold">Centered Tooltip Examples</h1>

      <div className="border rounded-md p-6 bg-gray-50">
        <h2 className="text-xl mb-4">Perfectly Centered Tooltips:</h2>
        <p className="text-center text-gray-600 mb-6">
          Content is centered relative to the trigger element
        </p>

        <div className="grid grid-cols-2 gap-12 place-items-center h-80">
          <div className="w-full flex justify-center">
            <Tooltip
              content={<div>I'am Hot and Duck!</div>}
              position="top"
              showArrow={false}
              // className="bg-blue-100 border-blue-200"
            >
              <Button variant="outline" className="w-40">
                Top Position
              </Button>
            </Tooltip>
          </div>

          <div className="w-full flex justify-center">
            <Tooltip
              content="This tooltip is centered below the button"
              position="bottom"
              className="bg-green-100 border-green-200"
            >
              <Button variant="outline" className="w-40">
                Bottom Position
              </Button>
            </Tooltip>
          </div>

          <div className="w-full flex justify-center">
            <Tooltip
              content="Left tooltip centered vertically"
              position="left"
              className="bg-amber-100 border-amber-200"
            >
              <Button variant="outline" className="h-20 flex items-center">
                Left Position
              </Button>
            </Tooltip>
          </div>

          <div className="w-full flex justify-center">
            <Tooltip
              content="Right tooltip centered vertically"
              position="right"
              className="bg-red-100 border-red-200"
            >
              <Button variant="outline" className="h-20 flex items-center">
                Right Position
              </Button>
            </Tooltip>
          </div>
        </div>
      </div>

      <div className="border rounded-md p-6 bg-gray-50">
        <h2 className="text-xl mb-4">Variable Content Length:</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 place-items-center">
          <Tooltip content="Short text" position="top">
            <Button>Short content</Button>
          </Tooltip>

          <Tooltip
            content="This is a much longer tooltip text that demonstrates how the tooltip remains centered even with varying content length"
            position="top"
          >
            <Button>Long content</Button>
          </Tooltip>

          <Tooltip
            content={
              <div className="flex flex-col items-center gap-2">
                <p className="font-bold">Rich Content</p>
                <p>With multiple lines</p>
                <div className="h-1 w-full bg-gray-200 rounded-full" />
                <p>Still perfectly centered</p>
              </div>
            }
            position="bottom"
          >
            <Button>Rich content</Button>
          </Tooltip>

          <Tooltip content="Wider trigger element" position="bottom">
            <Button className="w-56">Wide button with tooltip</Button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
