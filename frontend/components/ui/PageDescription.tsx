interface PageDescriptionProps {
  title: string;
}

const PageDescription = ({ title }: PageDescriptionProps) => {
  return (
    <section className="w-full py-4 px-1 sm:px-2 lg:px-4">
      <div className="">
        <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
          {title}
        </h1>
      </div>
    </section>
  );
};
export default PageDescription