interface InputFieldProps {
    label?: string;
    placeholder: string;
    value: string;
    type?: string;
    large?: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function InputField({
    label,
    placeholder,
    value,
    type = "text",
    large = false,
    onChange,
}: InputFieldProps) {
    const inputId = label ? label.toLowerCase().replace(/\s+/g, "-") : "input-field";

    return (
        <div className="w-full space-y-2">
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-sm font-medium text-gray-700"
                >
                    {label}
                </label>
            )}

            {large ? (
                <textarea
                    id={inputId}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out resize-none"
                    rows={4}
                />
            ) : (
                <input
                    id={inputId}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                />
            )}
        </div>
    );
}