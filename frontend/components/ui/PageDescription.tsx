interface PageDescriptionProps {
  title: string;
  description?: string;
}

const PageDescription = ({ title, description }: PageDescriptionProps) => {
  return (
    <section className="w-full py-4 px-1 sm:px-2 lg:px-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-text-secondary leading-relaxed max-w-2xl">
            {description}
          </p>
        )}
      </div>
    </section>
  );
};
export default PageDescription