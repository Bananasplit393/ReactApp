import React from "react";
import styles from "./Button.module.css";

// TypeScript-magi der tillader komponenten at være polymorfisk.
// Den kan nu arve props fra det element eller den komponent, den skal rendere som.
type ButtonProps<T extends React.ElementType> = {
	as?: T;
	children: React.ReactNode;
	className?: string;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

// Vi bruger generics (<T ...>) til at fange typen af det element, der skal renderes
const Button = <T extends React.ElementType = "button">({
	as,
	children,
	className = "",
	...rest
}: ButtonProps<T>) => {
	// Hvis 'as' proppen er givet, bruges den. Ellers er standarden en 'button'.
	const Component = as || "button";
	const buttonClassName = `${styles.button} ${className}`;

	// ...rest spreder alle andre props (f.eks. 'to' for en Link, 'type' for en button)
	// videre til den komponent, der bliver renderet.
	return (
		<Component className={buttonClassName} {...rest}>
			{children}
		</Component>
	);
};

export default Button;
