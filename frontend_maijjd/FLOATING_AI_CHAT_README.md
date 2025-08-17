# Floating AI Chat Button Component

A highly customizable, floating AI chat button component that can be used throughout the Maijjd website to provide instant AI assistance to users.

## 🚀 Features

- **6 Positioning Options**: bottom-right, bottom-left, top-right, top-left, center-right, center-left
- **5 Theme Variations**: Default, Gradient, Dark, Light, Neon
- **Auto-hide Functionality**: Automatically hides when not in use
- **Enhanced Tooltips**: Rich hover information with contextual details
- **Quick Actions Menu**: Minimized state with action shortcuts
- **Notification Badges**: Support for notification counts
- **Typing Indicators**: Visual feedback when AI is responding
- **Responsive Design**: Works seamlessly on all device sizes
- **Accessibility**: Proper ARIA labels and keyboard navigation

## 📦 Installation

The component is already included in the project. Simply import it:

```javascript
import FloatingAIChatButton from './components/FloatingAIChatButton';
```

## 🎯 Basic Usage

### Simple Implementation

```jsx
<FloatingAIChatButton />
```

### With Custom Position and Theme

```jsx
<FloatingAIChatButton 
  position="bottom-left"
  theme="dark"
/>
```

### With Software Context

```jsx
<FloatingAIChatButton 
  position="center-right"
  theme="gradient"
  software={{ name: "Maijjd CRM Pro" }}
/>
```

## ⚙️ Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `position` | string | `'bottom-right'` | Button position on screen |
| `theme` | string | `'default'` | Visual theme styling |
| `software` | object | `null` | Software context for personalized messages |
| `showNotifications` | boolean | `true` | Show notification badges |
| `autoHide` | boolean | `false` | Auto-hide when not in use |
| `className` | string | `''` | Additional CSS classes |

## 🎨 Available Themes

### 1. Default
- Blue to purple gradient
- White icons and text
- Standard shadow effects

### 2. Gradient
- Blue to purple to pink gradient
- Enhanced visual appeal
- Premium look and feel

### 3. Dark
- Dark gray background
- Professional appearance
- Subtle hover effects

### 4. Light
- White background with borders
- Gray text and icons
- Minimalist design

### 5. Neon
- Black background with cyan borders
- Cyberpunk aesthetic
- Glowing shadow effects

## 📍 Positioning Options

- **`bottom-right`**: Bottom right corner (default)
- **`bottom-left`**: Bottom left corner
- **`top-right`**: Top right corner
- **`top-left`**: Top left corner
- **`center-right`**: Center right side
- **`center-left`**: Center left side

## 🔧 Advanced Configuration

### Auto-hide with Hover Detection

```jsx
<FloatingAIChatButton 
  autoHide={true}
  position="bottom-right"
  theme="gradient"
/>
```

### Custom Styling

```jsx
<FloatingAIChatButton 
  className="custom-floating-button"
  theme="neon"
  position="top-left"
/>
```

### Disable Notifications

```jsx
<FloatingAIChatButton 
  showNotifications={false}
  theme="light"
/>
```

## 🎭 Demo Page

Visit `/ai-chat-demo` to see all variations in action:

- Interactive controls for each position
- Theme switching in real-time
- Multiple buttons simultaneously
- Feature showcase and usage examples

## 🏗️ Architecture

The component integrates with:

- **AIChatWidget**: Main chat interface
- **Tailwind CSS**: Styling and animations
- **Lucide React**: Icon library
- **React Hooks**: State management and effects

## 🎨 Customization

### Adding New Themes

Extend the `getThemeClasses()` function in the component:

```javascript
case 'custom':
  return 'bg-custom-color hover:bg-custom-hover';
```

### Custom Animations

Modify the CSS classes in the component or add custom CSS:

```css
.custom-floating-button {
  animation: custom-bounce 2s infinite;
}
```

## 📱 Mobile Responsiveness

- Automatically adjusts positioning for mobile devices
- Touch-friendly button sizes
- Responsive tooltip positioning
- Mobile-optimized quick actions menu

## ♿ Accessibility Features

- Proper ARIA labels
- Keyboard navigation support
- Focus management
- Screen reader compatibility
- High contrast themes

## 🔄 State Management

The component manages several internal states:

- `isOpen`: Chat widget visibility
- `isMinimized`: Minimized state
- `isHovered`: Hover detection for auto-hide
- `notificationCount`: Notification badge count
- `isTyping`: AI typing indicator

## 🚀 Performance Optimizations

- Conditional rendering of heavy components
- Debounced hover detection
- Efficient state updates
- Minimal re-renders
- Optimized animations

## 🧪 Testing

The component can be tested by:

1. Visiting the demo page
2. Testing different positions and themes
3. Verifying chat functionality
4. Checking mobile responsiveness
5. Testing accessibility features

## 📝 Examples

### E-commerce Integration

```jsx
<FloatingAIChatButton 
  position="bottom-right"
  theme="gradient"
  software={{ name: "Maijjd Store" }}
  showNotifications={true}
/>
```

### Support Page

```jsx
<FloatingAIChatButton 
  position="center-right"
  theme="dark"
  software={{ name: "Customer Support" }}
  autoHide={false}
/>
```

### Software Dashboard

```jsx
<FloatingAIChatButton 
  position="bottom-left"
  theme="neon"
  software={{ name: "Dashboard Assistant" }}
  className="dashboard-ai-button"
/>
```

## 🔮 Future Enhancements

- Voice command integration
- Multi-language support
- Advanced notification system
- Custom animation presets
- Theme builder interface
- Analytics integration

## 📞 Support

For questions or issues with the FloatingAIChatButton component:

1. Check the demo page for examples
2. Review the component source code
3. Test different configurations
4. Check browser console for errors

---

**Built with ❤️ for the Maijjd Software Platform**
