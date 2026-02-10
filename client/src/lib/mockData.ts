import { Message, Section, Bucket, Deliverable } from './types';

export const mockMessages: Message[] = [
  {
    id: '1',
    role: 'ai',
    content: "I'm ready to help you structure this decision. What are you trying to get done?",
    timestamp: '10:00 AM',
  },
  {
    id: '2',
    role: 'user',
    content: "We need to decide on the new office location by next month.",
    timestamp: '10:01 AM',
  },
  {
    id: '3',
    role: 'ai',
    content: "Okay, that's a significant operational decision. To help you with the office location search, I've outlined a few key areas we should cover: Financial Constraints, Employee Commute Impact, and Brand Alignment. Does this structure look right to you?",
    timestamp: '10:01 AM',
    hasSaveableContent: true,
  }
];

export const mockSections: Section[] = [
  {
    id: 'context',
    genericName: 'Context',
    subtitle: 'Where are we? Why now?',
    completeness: 80,
    totalItems: 5,
    completedItems: 4,
    content: "Current lease expires in 6 months. Team has grown by 40% since last year. We are shifting to a hybrid model.",
    isOpen: true
  },
  {
    id: 'objective',
    genericName: 'Objective',
    subtitle: 'What are we trying to accomplish?',
    completeness: 40,
    totalItems: 3,
    completedItems: 1,
    isOpen: false
  },
  {
    id: 'stakeholders',
    genericName: 'Stakeholders',
    subtitle: 'Board, Staff, Donors',
    completeness: 20,
    totalItems: 5,
    completedItems: 1,
    isOpen: false
  },
  {
    id: 'constraints',
    genericName: 'Constraints',
    subtitle: 'Budget, Location, Timeline',
    completeness: 0,
    totalItems: 3,
    completedItems: 0,
    isOpen: false
  }
];

export const mockBuckets: Bucket[] = [
  {
    id: 'research',
    name: 'Market Research',
    isOpen: true,
    items: [
      { id: '1', type: 'doc', title: 'Commercial Real Estate Report Q4', preview: 'Market trends indicate a drop in...', date: 'Feb 8' },
      { id: '2', type: 'link', title: 'Competitor Locations Map', preview: 'Map view of...', date: 'Feb 9' },
    ]
  },
  {
    id: 'interviews',
    name: 'Stakeholder Interviews',
    isOpen: false,
    items: [
      { id: '3', type: 'note', title: 'Notes from CEO meeting', preview: 'Prioritize natural light...', date: 'Feb 7' },
      { id: '4', type: 'chat', title: 'AI Chat: Employee Survey', preview: 'Summary of survey results...', date: 'Feb 6' },
    ]
  }
];

export const mockDeliverables: Deliverable[] = [
  {
    id: '1',
    title: 'Board Recommendation Memo',
    status: 'draft',
    lastEdited: 'Just now',
    engaged: true,
    content: `# Board Recommendation: New Office Location

## Executive Summary
We recommend proceeding with the downtown location due to its superior accessibility and alignment with our brand image, despite the slightly higher cost per square foot.

## Options Considered
1. Downtown High-Rise
2. Suburban Campus
3. Distributed Hub Model

## Analysis
...`
  },
  {
    id: '2',
    title: 'Employee Commute Analysis',
    status: 'review',
    lastEdited: '2 hours ago',
    engaged: false,
    content: 'Loading analysis...'
  }
];
