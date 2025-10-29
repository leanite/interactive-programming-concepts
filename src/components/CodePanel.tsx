import CodeViewer from "./CodeViewer";
import type { Language } from "../App";

// Example code snippets for each language
const codeSamples: Record<Language, string> = {
  java: `public class BubbleSort {
  public static void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n-1; i++)
      for (int j = 0; j < n-i-1; j++)
        if (arr[j] > arr[j+1]) {
          int temp = arr[j];
          arr[j] = arr[j+1];
          arr[j+1] = temp;
        }
  }
}`,
  python: `def bubble_sort(arr):
    for i in range(len(arr) - 1):
        for j in range(len(arr) - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr`,
  c: `void bubbleSort(int arr[], int n) {
  for (int i = 0; i < n-1; i++)
    for (int j = 0; j < n-i-1; j++)
      if (arr[j] > arr[j+1]) {
        int temp = arr[j];
        arr[j] = arr[j+1];
        arr[j+1] = temp;
      }
}`,
  rust: `pub fn bubble_sort(arr: &mut [i32]) {
    let n = arr.len();
    for i in 0..n-1 {
        for j in 0..n-i-1 {
            if arr[j] > arr[j+1] {
                arr.swap(j, j+1);
            }
        }
    }
}`,
  typescript: `export function bubbleSort(arr: number[]): number[] {
  const a = [...arr];
  for (let i = 0; i < a.length - 1; i++) {
    for (let j = 0; j < a.length - i - 1; j++) {
      if (a[j] > a[j + 1]) {
        const tmp = a[j];
        a[j] = a[j + 1];
        a[j + 1] = tmp;
      }
    }
  }
  return a;
}`,
};

type Props = {
  language: Language;
};

export default function CodePanel({ language }: Props) {
  return (
    <aside className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
      <div className="px-4 py-3 border-b border-neutral-800 text-sm opacity-80">
        Code ({language})
      </div>

      <CodeViewer
        language={language}
        code={codeSamples[language]}
        highlight={{ start: 3, end: 5 }} // Example range for visual test
      />
    </aside>
  );
}