# API Key Validation Test Plan

## Features Implemented

### 1. **Send Button State**
- ✅ **Without API Key**: Button appears grayed out (disabled state)
- ✅ **With API Key**: Button appears normal with hover effects  
- ✅ **Dynamic Updates**: Button state updates when API key is added/removed

### 2. **Keyboard Handling** 
- ✅ **Enter Key**: Prevented when no API key and shows notification
- ✅ **Input Detection**: Only triggers if there's text in the input field
- ✅ **Auto Settings**: Automatically opens Settings modal

### 3. **Toast Notifications**
- ✅ **Warning Style**: Yellow theme with settings icon
- ✅ **Auto Dismiss**: Disappears after 4 seconds
- ✅ **Positioning**: Fixed top-right, responsive

### 4. **Real-time Updates**
- ✅ **Storage Events**: Listens for localStorage changes
- ✅ **Custom Events**: Updates when API key modified in same tab
- ✅ **Instant Feedback**: Button state changes immediately

## Test Cases

### Test 1: No API Key
1. Clear API key in Settings
2. Type message in chat input
3. **Expected**: Send button is grayed out
4. Click send button or press Enter
5. **Expected**: Shows notification "Please enter your Gemini API key in Settings..."

### Test 2: Add API Key  
1. Open Settings
2. Enter valid API key
3. **Expected**: Send button becomes active immediately
4. **Expected**: Can send messages normally

### Test 3: Remove API Key
1. With API key set, clear it in Settings  
2. **Expected**: Send button immediately becomes disabled
3. Try to send message
4. **Expected**: Shows notification

### Test 4: Keyboard Shortcuts
1. No API key set
2. Type message, press Enter
3. **Expected**: Notification shows, Settings modal opens
4. **Expected**: Message not sent

## Visual States

```css
/* Disabled State */
.disabled-send-button {
  border-color: muted-foreground/30;
  background: muted-foreground/20;
  color: muted-foreground/60;
  cursor: not-allowed;
}

/* Active State */ 
.active-send-button {
  border-color: muted-foreground/60;
  background: primary;
  hover: primary/75;
}
```
