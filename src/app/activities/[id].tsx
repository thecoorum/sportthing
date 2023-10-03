'use client'

import { useApi } from "@/hooks/useApi"
import { useUser } from "@/hooks/useUser"

import { useRouter } from "next/router"
import { useEffect } from "react"

const Activities = () => {
  const { query } = useRouter()

  const user = useUser()
  const api = useApi()

  useEffect(() => {
    api.get('/activities', {
      params: {
        id: query.id
      }
    })
  }, [query, api])

  if (!user) return null

  return 
}