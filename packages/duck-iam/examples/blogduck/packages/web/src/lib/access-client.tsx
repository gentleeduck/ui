'use client'

import { createAccessControl } from '@gentleduck/iam/client/react'
import React from 'react'

export const { AccessProvider, useAccess, Can, Cannot } = createAccessControl(React)
