# IndexedDB Schema

## Object Stores

### Auth store

```
{
    initialized: true,
    locked: false,
    passwordType: "pin",
    showOnline: false,
    user: {
        ...user
    }
}
```

### Theme store

```
{
    darkMode: true,
    accent: "#fff",
    background: "none",
    animations: {
      speed: 0.25,
      spring: true,
    },
}
```

### Messages store

```
{
    messages: [{...message}]
}
```

### Contact store

```
{
    contacts: [{...contact}]
}
```

### Message settings store

```
{
    showImg: true,
    showLatestMessage: true,
    showTimeOfLatestMessage: true,
    showHowManyUnread: true,
    sort: "newest",
    order: "desc",
    showYouAreTyping: false,
    showYouHaveRead: false
}
```

### Contact settings store

```
{
    showImage: true,
    showLatestMessages: true,
    showHowMayUnreadMessages: true,
    sort: "last-name",
    order: "desc"
}
```
