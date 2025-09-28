#!/usr/bin/env tsx

import { readFileSync } from 'fs'
import { join } from 'path'

interface ValidationError {
  field: string
  message: string
  severity: 'error' | 'warning'
}

interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
  warnings: ValidationError[]
  todos: string[]
}

function validateContent(): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
    todos: []
  }

  try {
    // Read the CV content file
    const cvPath = join(process.cwd(), 'src/content/cv.ts')
    const content = readFileSync(cvPath, 'utf8')

    // Extract TODO comments
    const todoMatches = content.match(/\/\/ TODO:.*$/gm) || []
    const inlineTodos = content.match(/\[TODO:.*?\]/g) || []
    
    result.todos = [
      ...todoMatches.map((todo: string) => todo.replace(/^\/\/ TODO:\s*/, '')),
      ...inlineTodos.map((todo: string) => todo.replace(/\[TODO:\s*/, '').replace(/\]$/, ''))
    ]

    // Check for placeholder content
    const placeholderPatterns = [
      { pattern: /\[TODO.*?\]/g, field: 'General', message: 'Contains TODO placeholders' },
      { pattern: /'.*\[TODO.*?\].*'/g, field: 'Values', message: 'Contains placeholder values' }
    ]

    for (const { pattern, field, message } of placeholderPatterns) {
      const matches = content.match(pattern)
      if (matches && matches.length > 0) {
        result.warnings.push({
          field,
          message: `${message} (${matches.length} found)`,
          severity: 'warning'
        })
      }
    }

    // Validate required fields exist and aren't empty
    const requiredChecks = [
      { pattern: /name:\s*['"][^'"]*['"]/g, field: 'person.name' },
      { pattern: /email:\s*['"][^'"]*['"]/g, field: 'person.email' },
      { pattern: /headline:\s*['"][^'"]*['"]/g, field: 'person.headline' }
    ]

    for (const { pattern, field } of requiredChecks) {
      const matches = content.match(pattern)
      if (!matches || matches.length === 0) {
        result.errors.push({
          field,
          message: 'Required field is missing or empty',
          severity: 'error'
        })
        result.isValid = false
      }
    }

    // Check for empty arrays that should have content
    const arrayChecks = [
      { pattern: /education:\s*\[\s*\]/g, field: 'education' },
      { pattern: /experience:\s*\[\s*\]/g, field: 'experience' },
      { pattern: /projects:\s*\[\s*\]/g, field: 'projects' }
    ]

    for (const { pattern, field } of arrayChecks) {
      const matches = content.match(pattern)
      if (matches && matches.length > 0) {
        result.warnings.push({
          field,
          message: 'Array is empty - consider adding content',
          severity: 'warning'
        })
      }
    }

  } catch (error) {
    result.errors.push({
      field: 'file',
      message: `Failed to read CV content file: ${error instanceof Error ? error.message : 'Unknown error'}`,
      severity: 'error'
    })
    result.isValid = false
  }

  return result
}

function main() {
  console.log('🔍 Validating content...\n')
  
  const validation = validateContent()
  
  // Print errors
  if (validation.errors.length > 0) {
    console.log('❌ ERRORS:')
    validation.errors.forEach(error => {
      console.log(`   ${error.field}: ${error.message}`)
    })
    console.log()
  }
  
  // Print warnings
  if (validation.warnings.length > 0) {
    console.log('⚠️  WARNINGS:')
    validation.warnings.forEach(warning => {
      console.log(`   ${warning.field}: ${warning.message}`)
    })
    console.log()
  }
  
  // Print TODOs
  if (validation.todos.length > 0) {
    console.log('📝 TODO ITEMS:')
    validation.todos.forEach((todo, index) => {
      console.log(`   ${index + 1}. ${todo}`)
    })
    console.log()
  }
  
  // Summary
  if (validation.isValid) {
    if (validation.warnings.length === 0 && validation.todos.length === 0) {
      console.log('✅ Content validation passed with no issues!')
    } else {
      console.log('✅ Content validation passed, but please review warnings and TODOs above.')
    }
    process.exit(0)
  } else {
    console.log('❌ Content validation failed. Please fix the errors above.')
    process.exit(1)
  }
}

// Run main function if this file is executed directly
const isMainModule = import.meta.url.endsWith(process.argv[1]?.split(/[\\/]/).pop() || '')
if (isMainModule || process.argv[1]?.includes('validate-content')) {
  main()
}

export { validateContent }
