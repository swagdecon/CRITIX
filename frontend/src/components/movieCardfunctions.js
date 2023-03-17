function truncateDescription(description) {
  const words = description.split(" ");

  if (words.length > 30) {
    const truncated = words.slice(0, 30).join(" ");
    return truncated + "...";
  }

  return description;
}

export { truncateDescription };
