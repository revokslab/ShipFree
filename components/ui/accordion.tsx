'use client'

import { Accordion as AccordionPrimitive } from '@base-ui/react/accordion'
import { Plus, Minus } from 'lucide-react'

import { cn } from '@/lib/utils'

function Accordion(props: AccordionPrimitive.Root.Props) {
  return <AccordionPrimitive.Root data-slot='accordion' {...props} />
}

function AccordionItem({ className, ...props }: AccordionPrimitive.Item.Props) {
  return (
    <AccordionPrimitive.Item
      className={cn('border-b last:border-b-0', className)}
      data-slot='accordion-item'
      {...props}
    />
  )
}

function AccordionTrigger({ className, children, ...props }: AccordionPrimitive.Trigger.Props) {
  return (
    <AccordionPrimitive.Header className='flex'>
      <AccordionPrimitive.Trigger
        className={cn(
          'group accordion-trigger flex flex-1 cursor-pointer items-start justify-between gap-4 rounded-md py-4 text-left font-medium text-sm outline-none transition-all focus-visible:ring-[3px] focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-64',
          className
        )}
        data-slot='accordion-trigger'
        {...props}
      >
        {children}
        <div className='relative size-4 shrink-0 translate-y-0.5'>
          <Plus className='pointer-events-none size-4 opacity-80 transition-opacity duration-200 ease-in-out group-data-[panel-open]:opacity-0' />
          <Minus className='pointer-events-none size-4 opacity-0 absolute inset-0 transition-opacity duration-200 ease-in-out group-data-[panel-open]:opacity-80' />
        </div>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionPanel({ className, children, ...props }: AccordionPrimitive.Panel.Props) {
  return (
    <AccordionPrimitive.Panel
      className='h-(--accordion-panel-height) overflow-hidden text-muted-foreground text-sm transition-[height] duration-200 ease-in-out data-ending-style:h-0 data-starting-style:h-0'
      data-slot='accordion-panel'
      {...props}
    >
      <div className={cn('pt-0 pb-4', className)}>{children}</div>
    </AccordionPrimitive.Panel>
  )
}

export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
  AccordionPanel as AccordionContent,
}
