---
title: 'test'
description: 'meta description of the page'
date: 2021-10-21
tags: ['test', 'test2']
---

## Using Backticks

### 샵세개

#### 샵네개

##### 다섯개

Here's an example of inline TypeScript code using backticks:

`const y: string = "Hello, world!";`

## Code Block (for comparison)

  ```javascript [file.js]{4-6,7} meta-info=val
  export default () => {
  console.log('Code block')
  console.log('Code block')
}
  ```


```java
public static void main() {
    
}
```

```java
public static void main() {
    
}
```

```java
public static void main() {
    
}
```
```vue
<script setup lang="ts">
  const links = [{
    label: 'Home',
    to: '/'
  }, {
    label: 'Navigation'
  }, {
    label: 'Breadcrumb'
  }]
</script>

<template>
  <UBreadcrumb :links="links" :divider="null" :ui="{ ol: 'gap-x-3' }">
    <template #icon="{ link, index, isActive }">
      <UAvatar
          :alt="(index + 1 ).toString()"
          :ui="{
          background: isActive ? 'bg-primary-500 dark:bg-primary-400' : undefined,
          placeholder: isActive ? 'text-white dark:text-gray-900' : !!link.to ? 'group-hover:text-gray-700 dark:group-hover:text-gray-200' : ''
        }"
          size="xs"
      />
    </template>
  </UBreadcrumb>
</template>


```
> 인용구 테스트

As you can see, the code block above is highlighted, but the inline code example is not.
