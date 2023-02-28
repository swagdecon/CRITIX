function truncateDescription(description) {
  const words = description.split(" ");

  if (words.length > 53) {
    const truncated = words.slice(0, 53).join(" ");
    return truncated + "...";
  }

  return description;
}
export default truncateDescription;
