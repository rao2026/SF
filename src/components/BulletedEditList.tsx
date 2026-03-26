import React from 'react';

interface BulletedEditListProps {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  addButtonText?: string;
}

export const BulletedEditList: React.FC<BulletedEditListProps> = ({
  items,
  onChange,
  placeholder = "Enter item text...",
  addButtonText = "Add new item"
}) => {
  // Ensure we always have at least one empty item at the end for editing
  const displayItems = React.useMemo(() => {
    // If empty, show one empty field
    if (items.length === 0) return [''];
    
    // If last item is not empty, add an empty one
    if (items[items.length - 1]?.trim() !== '') {
      return [...items, ''];
    }
    
    // Otherwise, use items as-is
    return items;
  }, [items]);
  
  const textareaRefs = React.useRef<(HTMLTextAreaElement | null)[]>([]);

  // Auto-resize all textareas when items change
  React.useEffect(() => {
    textareaRefs.current.forEach((textarea) => {
      if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
      }
    });
  }, [displayItems]);

  const addNewItem = () => {
    onChange([...items, '']);
  };

  const updateItem = (index: number, value: string) => {
    const newItems = [...displayItems];
    newItems[index] = value;
    onChange(newItems);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>, index: number) => {
    const textarea = e.currentTarget;
    const cursorPosition = textarea.selectionStart;
    const textLength = textarea.value.length;
    
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      // Only create a new item if the current item has text
      if (displayItems[index].trim() !== '') {
        const newItems = [...displayItems];
        newItems.splice(index + 1, 0, '');
        onChange(newItems);
        // Capture the parent element before the async operation
        const parentList = e.currentTarget.parentElement?.parentElement;
        setTimeout(() => {
          if (parentList) {
            const textareas = parentList.querySelectorAll('textarea');
            if (textareas && textareas[index + 1]) {
              (textareas[index + 1] as HTMLTextAreaElement).focus();
            }
          }
        }, 0);
      }
    } else if (e.key === 'Backspace' && displayItems[index] === '' && displayItems.length > 1 && cursorPosition === 0) {
      // Only remove bullet when field is empty AND cursor is at the start
      e.preventDefault();
      const newItems = displayItems.filter((_, i) => i !== index);
      onChange(newItems);
      // Capture the parent element before the async operation
      const parentList = e.currentTarget.parentElement?.parentElement;
      setTimeout(() => {
        if (parentList) {
          const textareas = parentList.querySelectorAll('textarea');
          if (textareas && textareas[Math.max(0, index - 1)]) {
            const prevTextarea = textareas[Math.max(0, index - 1)] as HTMLTextAreaElement;
            prevTextarea.focus();
            // Place cursor at the end
            prevTextarea.setSelectionRange(prevTextarea.value.length, prevTextarea.value.length);
          }
        }
      }, 0);
    } else if (e.key === 'ArrowUp' && cursorPosition === 0 && index > 0) {
      // Move to previous textarea when at the start and pressing up
      e.preventDefault();
      const prevTextarea = textareaRefs.current[index - 1];
      if (prevTextarea) {
        prevTextarea.focus();
        prevTextarea.setSelectionRange(0, 0);
      }
    } else if (e.key === 'ArrowDown' && cursorPosition === textLength && index < displayItems.length - 1) {
      // Move to next textarea when at the end and pressing down
      e.preventDefault();
      const nextTextarea = textareaRefs.current[index + 1];
      if (nextTextarea) {
        nextTextarea.focus();
        nextTextarea.setSelectionRange(0, 0);
      }
    } else if (e.key === 'ArrowLeft' && cursorPosition === 0 && index > 0) {
      // Move to end of previous textarea when at the start and pressing left
      e.preventDefault();
      const prevTextarea = textareaRefs.current[index - 1];
      if (prevTextarea) {
        prevTextarea.focus();
        prevTextarea.setSelectionRange(prevTextarea.value.length, prevTextarea.value.length);
      }
    } else if (e.key === 'ArrowRight' && cursorPosition === textLength && index < displayItems.length - 1) {
      // Move to start of next textarea when at the end and pressing right
      e.preventDefault();
      const nextTextarea = textareaRefs.current[index + 1];
      if (nextTextarea) {
        nextTextarea.focus();
        nextTextarea.setSelectionRange(0, 0);
      }
    }
  };

  const adjustHeight = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  };

  return (
    <div className="border border-gray-300 rounded-lg p-4 min-h-[200px] focus-within:ring-2 focus-within:ring-[#284497] focus-within:border-transparent bg-white">
      <ul className="space-y-2">
        {displayItems.map((item, index) => (
          <li key={index} className="flex items-start gap-3">
            <div className="w-1 h-1 rounded-full bg-[#284497] flex-shrink-0 mt-2"></div>
            <textarea
              ref={(el) => {
                textareaRefs.current[index] = el;
                if (el) {
                  adjustHeight(el);
                }
              }}
              value={item}
              onChange={(e) => {
                updateItem(index, e.target.value);
                adjustHeight(e.target);
              }}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="flex-1 text-sm border-none outline-none bg-transparent leading-relaxed resize-none min-h-[24px] overflow-y-auto"
              placeholder={placeholder}
              rows={1}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};